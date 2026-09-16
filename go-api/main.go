package main

import (
	"context"
	"encoding/json"
	"fmt"
	"log"
	"net"
	"net/http"
	"net/url"
	"os"
	"os/exec"
	"regexp"
	"sort"
	"strconv"
	"strings"
	"time"
)

// ---------- shared helpers (port of src/lib/dns.ts) ----------

var dnsTypes = map[string]bool{"A": true, "AAAA": true, "MX": true, "CNAME": true, "TXT": true, "NS": true}

var labelRe = regexp.MustCompile(`^[A-Za-z0-9-]+$`)

func validLookupName(name string) bool {
	s := strings.TrimSpace(name)
	s = strings.TrimSuffix(s, ".")
	if len(s) == 0 || len(s) > 253 {
		return false
	}
	if net.ParseIP(s) != nil {
		return true
	}
	matched, _ := regexp.MatchString(`^[A-Za-z0-9.-]+$`, s)
	if !matched {
		return false
	}
	if strings.Contains(s, "..") {
		return false
	}
	labels := strings.Split(s, ".")
	if len(labels) < 2 && !strings.HasSuffix(s, ".local") {
		if matched, _ := regexp.MatchString(`^[A-Za-z0-9-]+$`, s); !matched {
			return false
		}
		return true
	}
	for _, l := range labels {
		if len(l) == 0 || len(l) > 63 || strings.HasPrefix(l, "-") || strings.HasSuffix(l, "-") {
			return false
		}
	}
	return true
}

func isNonPublicIP(ipStr string) bool {
	ip := net.ParseIP(ipStr)
	if ip == nil {
		return false
	}
	if ip4 := ip.To4(); ip4 != nil {
		o := ip4
		if o[0] == 10 {
			return true
		}
		if o[0] == 172 && o[1] >= 16 && o[1] <= 31 {
			return true
		}
		if o[0] == 192 && o[1] == 168 {
			return true
		}
		if o[0] == 127 {
			return true
		}
		if o[0] == 169 && o[1] == 254 {
			return true
		}
		if o[0] == 0 {
			return true
		}
		if o[0] >= 224 {
			return true
		}
		if o[0] == 100 && o[1] >= 64 && o[1] <= 127 {
			return true
		}
		if o[0] == 192 && o[1] == 0 && o[2] == 2 {
			return true
		}
		return false
	}
	low := strings.ToLower(ipStr)
	if low == "::1" || low == "::" {
		return true
	}
	if strings.HasPrefix(low, "fe80:") {
		return true
	}
	if strings.HasPrefix(low, "fc") || strings.HasPrefix(low, "fd") {
		return true
	}
	if strings.HasPrefix(low, "ff") {
		return true
	}
	if strings.HasPrefix(low, "2001:db8") {
		return true
	}
	if low == "::ffff:0:0" || ipStr == "::ffff:0.0.0.0" {
		return true
	}
	return false
}

func assertPublicHost(host string) ([]string, error) {
	s := strings.TrimSpace(host)
	if ip := net.ParseIP(s); ip != nil {
		if isNonPublicIP(s) {
			return nil, fmt.Errorf("Refused: target resolves to a private/internal address.")
		}
		return []string{s}, nil
	}
	ctx, cancel := context.WithTimeout(context.Background(), 8*time.Second)
	defer cancel()
	addrs, err := net.DefaultResolver.LookupIPAddr(ctx, s)
	if err != nil {
		return nil, err
	}
	ips := make([]string, len(addrs))
	for i, a := range addrs {
		ips[i] = a.IP.String()
		if isNonPublicIP(ips[i]) {
			return nil, fmt.Errorf("Refused: target resolves to a private/internal address.")
		}
	}
	return ips, nil
}

func validHttpURL(raw string) (*url.URL, bool) {
	s := strings.TrimSpace(raw)
	if matched, _ := regexp.MatchString(`^[a-zA-Z][a-zA-Z0-9+.-]*://`, s); matched {
		if matched2, _ := regexp.MatchString(`(?i)^https?://`, s); !matched2 {
			return nil, false
		}
	}
	withScheme := s
	if matched, _ := regexp.MatchString(`(?i)^https?://`, s); !matched {
		withScheme = "https://" + s
	}
	u, err := url.Parse(withScheme)
	if err != nil {
		return nil, false
	}
	if u.Scheme != "http" && u.Scheme != "https" {
		return nil, false
	}
	if !validLookupName(u.Hostname()) {
		return nil, false
	}
	return u, true
}

func isDNSType(s string) bool { return dnsTypes[strings.ToUpper(s)] }

func writeJSON(w http.ResponseWriter, status int, v any) {
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(status)
	_ = json.NewEncoder(w).Encode(v)
}

// ---------- DNS handler (port of src/lib/dns.ts resolveRecords) ----------

func handleDNS(w http.ResponseWriter, r *http.Request) {
	name := strings.TrimSpace(r.URL.Query().Get("name"))
	typeRaw := strings.ToUpper(strings.TrimSpace(r.URL.Query().Get("type")))
	if typeRaw == "" {
		typeRaw = "A"
	}
	if !validLookupName(name) {
		writeJSON(w, 400, map[string]string{"error": "Invalid hostname. Use letters, digits, dots, hyphens (e.g. example.com)."})
		return
	}
	if !isDNSType(typeRaw) {
		writeJSON(w, 400, map[string]string{"error": fmt.Sprintf("Invalid type. Use one of: A, AAAA, MX, CNAME, TXT, NS.")})
		return
	}
	host := strings.TrimSuffix(strings.TrimSpace(name), ".")
	ctx, cancel := context.WithTimeout(r.Context(), 8*time.Second)
	defer cancel()

	var answer map[string]any
	var err error
	switch typeRaw {
	case "A":
		var ips []net.IPAddr
		ips, err = net.DefaultResolver.LookupIPAddr(ctx, host)
		if err == nil {
			// Filter to v4 only for parity; LookupIPAddr returns both, but we mimic resolve4
			var vals []string
			for _, ip := range ips {
				if ip.IP.To4() != nil {
					vals = append(vals, ip.IP.String())
				}
			}
			if len(vals) == 0 {
				err = fmt.Errorf("ENODATA")
			} else {
				answer = map[string]any{"type": "A", "name": host, "values": vals, "ttlSeconds": nil}
			}
		}
	case "AAAA":
		var ips []net.IPAddr
		ips, err = net.DefaultResolver.LookupIPAddr(ctx, host)
		if err == nil {
			var vals []string
			for _, ip := range ips {
				if ip.IP.To4() == nil {
					vals = append(vals, ip.IP.String())
				}
			}
			if len(vals) == 0 {
				err = fmt.Errorf("ENODATA")
			} else {
				answer = map[string]any{"type": "AAAA", "name": host, "values": vals, "ttlSeconds": nil}
			}
		}
	case "MX":
		var mxs []*net.MX
		mxs, err = net.DefaultResolver.LookupMX(ctx, host)
		if err == nil {
			sort.Slice(mxs, func(i, j int) bool { return mxs[i].Pref < mxs[j].Pref })
			var vals []string
			for _, mx := range mxs {
				vals = append(vals, fmt.Sprintf("%d %s", mx.Pref, mx.Host))
			}
			answer = map[string]any{"type": "MX", "name": host, "values": vals, "ttlSeconds": nil}
		}
	case "CNAME":
		var cname string
		cname, err = net.DefaultResolver.LookupCNAME(ctx, host)
		if err == nil {
			answer = map[string]any{"type": "CNAME", "name": host, "values": []string{strings.TrimSuffix(cname, ".")}, "ttlSeconds": nil}
		}
	case "TXT":
		var txts []string
		txts, err = net.DefaultResolver.LookupTXT(ctx, host)
		if err == nil {
			answer = map[string]any{"type": "TXT", "name": host, "values": txts, "ttlSeconds": nil}
		}
	case "NS":
		var nss []*net.NS
		nss, err = net.DefaultResolver.LookupNS(ctx, host)
		if err == nil {
			var vals []string
			for _, ns := range nss {
				vals = append(vals, strings.TrimSuffix(ns.Host, "."))
			}
			sort.Strings(vals)
			answer = map[string]any{"type": "NS", "name": host, "values": vals, "ttlSeconds": nil}
		}
	}
	if err != nil {
		msg := err.Error()
		status := 502
		if regexp.MustCompile(`(?i)ENOTFOUND|ENODATA|ESERVFAIL`).MatchString(msg) {
			status = 404
		}
		var readable string
		switch {
		case regexp.MustCompile(`(?i)ENOTFOUND`).MatchString(msg):
			readable = fmt.Sprintf("No DNS answer: %s does not exist or has no %s record.", name, typeRaw)
		case regexp.MustCompile(`(?i)ENODATA`).MatchString(msg):
			readable = fmt.Sprintf("No %s record for %s. Host exists but lacks this record type.", typeRaw, name)
		case regexp.MustCompile(`(?i)ESERVFAIL|ETIMEDOUT|timed out|deadline`).MatchString(msg):
			readable = fmt.Sprintf("DNS server failed or timed out for %s. Try again.", name)
		default:
			readable = fmt.Sprintf("Lookup failed: %s", msg)
		}
		writeJSON(w, status, map[string]string{"error": readable})
		return
	}
	writeJSON(w, 200, map[string]any{"ok": true, "answer": answer})
}

// ---------- TCP probe ----------

func handleTCP(w http.ResponseWriter, r *http.Request) {
	host := strings.TrimSpace(r.URL.Query().Get("host"))
	portRaw := strings.TrimSpace(r.URL.Query().Get("port"))
	port, err := strconv.Atoi(portRaw)
	if !validLookupName(host) {
		writeJSON(w, 400, map[string]string{"error": "Invalid host. Use a hostname or IP, e.g. example.com."})
		return
	}
	if portRaw == "" || err != nil || port < 1 || port > 65535 {
		writeJSON(w, 400, map[string]string{"error": "Invalid port. Use 1-65535, e.g. 443."})
		return
	}
	if _, err := assertPublicHost(host); err != nil {
		writeJSON(w, 403, map[string]string{"error": err.Error()})
		return
	}
	start := time.Now()
	conn, err := net.DialTimeout("tcp", net.JoinHostPort(host, strconv.Itoa(port)), 4*time.Second)
	elapsed := time.Since(start).Milliseconds()
	if err != nil || conn == nil {
		writeJSON(w, 502, map[string]string{"error": fmt.Sprintf("TCP connect to %s:%d failed or timed out. Port may be closed or firewalled.", host, port)})
		return
	}
	_ = conn.Close()
	writeJSON(w, 200, map[string]any{"ok": true, "host": host, "port": port, "elapsedMs": elapsed})
}

// ---------- Headers ----------

func handleHeaders(w http.ResponseWriter, r *http.Request) {
	raw := strings.TrimSpace(r.URL.Query().Get("url"))
	target, ok := validHttpURL(raw)
	if !ok {
		writeJSON(w, 400, map[string]string{"error": "Invalid URL. Use http(s)://host/path, e.g. https://example.com."})
		return
	}
	if _, err := assertPublicHost(target.Hostname()); err != nil {
		writeJSON(w, 403, map[string]string{"error": err.Error()})
		return
	}
	client := &http.Client{
		Timeout: 12 * time.Second,
		CheckRedirect: func(req *http.Request, via []*http.Request) error {
			return http.ErrUseLastResponse
		},
		Transport: &http.Transport{
			// default
		},
	}
	start := time.Now()
	req, _ := http.NewRequestWithContext(r.Context(), "GET", target.String(), nil)
	req.Header.Set("User-Agent", "didyoupingit-header-check/1.0")
	resp, err := client.Do(req)
	elapsed := time.Since(start).Milliseconds()
	if err != nil {
		msg := err.Error()
		if strings.Contains(strings.ToLower(msg), "context deadline") || strings.Contains(strings.ToLower(msg), "timeout") {
			writeJSON(w, 504, map[string]string{"error": "Timed out after 12s. Host may be down or blocking."})
			return
		}
		writeJSON(w, 502, map[string]string{"error": fmt.Sprintf("Fetch failed: %s", msg)})
		return
	}
	defer resp.Body.Close()
	headers := map[string]string{}
	for k, v := range resp.Header {
		headers[strings.ToLower(k)] = strings.Join(v, ", ")
	}
	writeJSON(w, 200, map[string]any{
		"ok": true, "url": target.String(), "status": resp.StatusCode, "statusText": http.StatusText(resp.StatusCode),
		"elapsedMs": elapsed, "redirected": resp.StatusCode >= 300 && resp.StatusCode < 400,
		"location": resp.Header.Get("Location"), "headers": headers,
	})
}

// ---------- Ping (icmp + tcp fallback) ----------

func runCmd(cmd string, args []string, timeout time.Duration) (string, error) {
	ctx, cancel := context.WithTimeout(context.Background(), timeout)
	defer cancel()
	c := exec.CommandContext(ctx, cmd, args...)
	out, err := c.CombinedOutput()
	s := string(out)
	if err != nil {
		if ctx.Err() == context.DeadlineExceeded {
			return s, fmt.Errorf("timeout")
		}
		// ENOENT check: Go returns *exec.Error
		if strings.Contains(err.Error(), "executable file not found") {
			return s, fmt.Errorf("BINARY_MISSING:%s", cmd)
		}
		// ping exits nonzero on loss but still useful output, return output
		if s != "" {
			return s, nil
		}
		return s, err
	}
	return s, nil
}

var lossRe = regexp.MustCompile(`(\d+) packets transmitted,\s*(\d+) received,\s*([\d.]+)% packet loss`)
var rttRe = regexp.MustCompile(`min/avg/max(?:/mdev)? = ([\d.]+)/([\d.]+)/([\d.]+)`)

func handlePing(w http.ResponseWriter, r *http.Request) {
	host := strings.TrimSpace(r.URL.Query().Get("host"))
	if !validLookupName(host) {
		writeJSON(w, 400, map[string]string{"error": "Invalid host. Use a hostname or IP, e.g. example.com."})
		return
	}
	if _, err := assertPublicHost(host); err != nil {
		writeJSON(w, 403, map[string]string{"error": err.Error()})
		return
	}
	// try icmp
	if out, err := runCmd("ping", []string{"-c", "3", "-W", "2", host}, 15*time.Second); err == nil {
		mLoss := lossRe.FindStringSubmatch(out)
		if mLoss != nil {
			transmitted, _ := strconv.Atoi(mLoss[1])
			received, _ := strconv.Atoi(mLoss[2])
			lossPct, _ := strconv.ParseFloat(mLoss[3], 64)
			mRtt := rttRe.FindStringSubmatch(out)
			var min, avg, max float64
			if mRtt != nil {
				min, _ = strconv.ParseFloat(mRtt[1], 64)
				avg, _ = strconv.ParseFloat(mRtt[2], 64)
				max, _ = strconv.ParseFloat(mRtt[3], 64)
			}
			raw := ""
			lines := strings.Split(strings.TrimSpace(out), "\n")
			if len(lines) >= 2 {
				raw = strings.Join(lines[len(lines)-2:], "\n")
			} else {
				raw = strings.TrimSpace(out)
			}
			writeJSON(w, 200, map[string]any{
				"ok": true, "host": host, "method": "icmp", "raw": raw,
				"transmitted": transmitted, "received": received, "lossPct": lossPct,
				"min": min, "avg": avg, "max": max,
			})
			return
		}
		if err != nil && strings.HasPrefix(err.Error(), "BINARY_MISSING") {
			// fall through to tcp
		} else if out != "" {
			// not parsable but not missing binary -> fall through
		}
	}
	// tcp fallback
	ports := []int{443, 80}
	var samples []int64
	for _, port := range ports {
		for i := 0; i < 2; i++ {
			t0 := time.Now()
			conn, err := net.DialTimeout("tcp", net.JoinHostPort(host, strconv.Itoa(port)), 4*time.Second)
			if err == nil && conn != nil {
				_ = conn.Close()
				samples = append(samples, time.Since(t0).Milliseconds())
			}
		}
		if len(samples) >= 2 {
			break
		}
	}
	if len(samples) == 0 {
		writeJSON(w, 502, map[string]string{"error": "TCP connect failed on ports 443 and 80. Host may be down or firewalled."})
		return
	}
	var min, max, sum int64
	min = samples[0]
	max = samples[0]
	for _, v := range samples {
		if v < min {
			min = v
		}
		if v > max {
			max = v
		}
		sum += v
	}
	avg := (sum + int64(len(samples)/2)) / int64(len(samples))
	writeJSON(w, 200, map[string]any{
		"ok": true, "host": host, "method": "tcp", "transmitted": 4, "received": 4, "lossPct": 0,
		"min": min, "avg": avg, "max": max, "detail": "TCP connect latency (ICMP unavailable from this host).",
	})
}

// ---------- Traceroute ----------

func handleTraceroute(w http.ResponseWriter, r *http.Request) {
	host := strings.TrimSpace(r.URL.Query().Get("host"))
	maxHopsRaw := r.URL.Query().Get("maxHops")
	if maxHopsRaw == "" {
		maxHopsRaw = "20"
	}
	mh, _ := strconv.Atoi(maxHopsRaw)
	if mh < 2 {
		mh = 2
	}
	if mh > 30 {
		mh = 30
	}
	if !validLookupName(host) {
		writeJSON(w, 400, map[string]string{"error": "Invalid host. Use a hostname or IP, e.g. example.com."})
		return
	}
	if _, err := assertPublicHost(host); err != nil {
		writeJSON(w, 403, map[string]string{"error": err.Error()})
		return
	}
	cmds := [][]string{
		{"traceroute", "-n", "-w", "2", "-q", "1", "-m", strconv.Itoa(mh), host},
		{"tracepath", "-n", "-m", strconv.Itoa(mh), host},
	}
	var errs []string
	for _, c := range cmds {
		out, err := runCmd(c[0], c[1:], 45*time.Second)
		if err == nil && strings.TrimSpace(out) != "" {
			writeJSON(w, 200, map[string]any{"ok": true, "host": host, "method": c[0], "raw": strings.TrimSpace(out)})
			return
		}
		msg := ""
		if err != nil {
			msg = err.Error()
		} else {
			msg = "no output"
		}
		errs = append(errs, fmt.Sprintf("%s: %s", c[0], msg))
		if err != nil && msg != "BINARY_MISSING" && !strings.Contains(msg, "BINARY_MISSING") {
			break
		}
	}
	allMissing := true
	for _, e := range errs {
		if !strings.Contains(e, "BINARY_MISSING") {
			allMissing = false
			break
		}
	}
	if allMissing {
		writeJSON(w, 501, map[string]string{"error": "Traceroute binary unavailable on this host. Run `traceroute HOST` or `tracert HOST` locally instead."})
		return
	}
	writeJSON(w, 502, map[string]string{"error": fmt.Sprintf("Traceroute failed. %s", strings.Join(errs, " "))[:500]})
}

func handleHealth(w http.ResponseWriter, r *http.Request) {
	writeJSON(w, 200, map[string]string{"status": "ok", "service": "go-api"})
}

func main() {
	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}
	mux := http.NewServeMux()
	mux.HandleFunc("/health", handleHealth)
	mux.HandleFunc("/api/dns", handleDNS)
	mux.HandleFunc("/api/ping", handlePing)
	mux.HandleFunc("/api/tcp", handleTCP)
	mux.HandleFunc("/api/headers", handleHeaders)
	mux.HandleFunc("/api/traceroute", handleTraceroute)

	// CORS for bench direct hits (allow any origin for self-host bench)
	handler := http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Access-Control-Allow-Origin", "*")
		w.Header().Set("Access-Control-Allow-Methods", "GET, OPTIONS")
		w.Header().Set("Access-Control-Allow-Headers", "Content-Type")
		if r.Method == "OPTIONS" {
			w.WriteHeader(204)
			return
		}
		mux.ServeHTTP(w, r)
	})

	log.Printf("go-api listening on :%s", port)
	log.Fatal(http.ListenAndServe(":"+port, handler))
}
