export interface PortInfo {
  port: number;
  protocol: string;
  service: string;
  description: string;
}

const PORTS: PortInfo[] = [
  { port: 20, protocol: "TCP", service: "FTP-DATA", description: "File Transfer Protocol data transfer" },
  { port: 21, protocol: "TCP", service: "FTP", description: "File Transfer Protocol control" },
  { port: 22, protocol: "TCP", service: "SSH", description: "Secure Shell remote login" },
  { port: 23, protocol: "TCP", service: "Telnet", description: "Unencrypted remote login, legacy" },
  { port: 25, protocol: "TCP", service: "SMTP", description: "Simple Mail Transfer, sending email" },
  { port: 53, protocol: "TCP/UDP", service: "DNS", description: "Domain Name System resolution" },
  { port: 67, protocol: "UDP", service: "DHCP server", description: "Dynamic Host Configuration, server side" },
  { port: 68, protocol: "UDP", service: "DHCP client", description: "Dynamic Host Configuration, client side" },
  { port: 69, protocol: "UDP", service: "TFTP", description: "Trivial File Transfer Protocol" },
  { port: 80, protocol: "TCP", service: "HTTP", description: "World Wide Web, unencrypted" },
  { port: 110, protocol: "TCP", service: "POP3", description: "Post Office Protocol, fetching email" },
  { port: 119, protocol: "TCP", service: "NNTP", description: "Network News Transfer Protocol" },
  { port: 123, protocol: "UDP", service: "NTP", description: "Network Time Protocol sync" },
  { port: 135, protocol: "TCP", service: "RPC", description: "Windows RPC endpoint mapper" },
  { port: 137, protocol: "UDP", service: "NetBIOS-NS", description: "NetBIOS name service" },
  { port: 138, protocol: "UDP", service: "NetBIOS-DGM", description: "NetBIOS datagram service" },
  { port: 139, protocol: "TCP", service: "NetBIOS-SSN", description: "NetBIOS session, SMB over NetBIOS" },
  { port: 143, protocol: "TCP", service: "IMAP", description: "Internet Message Access Protocol" },
  { port: 161, protocol: "UDP", service: "SNMP", description: "Simple Network Management queries" },
  { port: 162, protocol: "UDP", service: "SNMP-Trap", description: "SNMP trap notifications" },
  { port: 179, protocol: "TCP", service: "BGP", description: "Border Gateway Protocol routing" },
  { port: 194, protocol: "TCP", service: "IRC", description: "Internet Relay Chat" },
  { port: 389, protocol: "TCP", service: "LDAP", description: "Lightweight Directory Access Protocol" },
  { port: 443, protocol: "TCP", service: "HTTPS", description: "HTTP over TLS, encrypted web" },
  { port: 445, protocol: "TCP", service: "SMB", description: "Server Message Block file sharing" },
  { port: 465, protocol: "TCP", service: "SMTPS", description: "SMTP over TLS, email submission" },
  { port: 514, protocol: "UDP", service: "Syslog", description: "System logging transport" },
  { port: 515, protocol: "TCP", service: "LPD", description: "Line Printer Daemon" },
  { port: 520, protocol: "UDP", service: "RIP", description: "Routing Information Protocol" },
  { port: 587, protocol: "TCP", service: "SMTP submission", description: "Mail submission with STARTTLS" },
  { port: 593, protocol: "TCP", service: "RPC-HTTPS", description: "RPC over HTTPS" },
  { port: 636, protocol: "TCP", service: "LDAPS", description: "LDAP over TLS" },
  { port: 646, protocol: "TCP", service: "LDP", description: "Label Distribution Protocol, MPLS" },
  { port: 691, protocol: "TCP", service: "L2TP", description: "Layer 2 Tunneling control" },
  { port: 993, protocol: "TCP", service: "IMAPS", description: "IMAP over TLS" },
  { port: 995, protocol: "TCP", service: "POP3S", description: "POP3 over TLS" },
  { port: 1433, protocol: "TCP", service: "MSSQL", description: "Microsoft SQL Server database" },
  { port: 1434, protocol: "UDP", service: "MSSQL browser", description: "SQL Server instance discovery" },
  { port: 1521, protocol: "TCP", service: "Oracle DB", description: "Oracle database listener" },
  { port: 1723, protocol: "TCP", service: "PPTP", description: "Point-to-Point Tunneling VPN" },
  { port: 1812, protocol: "UDP", service: "RADIUS auth", description: "RADIUS authentication" },
  { port: 1813, protocol: "UDP", service: "RADIUS acct", description: "RADIUS accounting" },
  { port: 2049, protocol: "TCP", service: "NFS", description: "Network File System" },
  { port: 2181, protocol: "TCP", service: "ZooKeeper", description: "Apache ZooKeeper coordination" },
  { port: 2375, protocol: "TCP", service: "Docker", description: "Docker daemon API, unencrypted" },
  { port: 2376, protocol: "TCP", service: "Docker TLS", description: "Docker daemon API over TLS" },
  { port: 3000, protocol: "TCP", service: "Dev server", description: "Common dev server port, Node/Rails" },
  { port: 3306, protocol: "TCP", service: "MySQL", description: "MySQL/MariaDB database" },
  { port: 3389, protocol: "TCP", service: "RDP", description: "Remote Desktop Protocol, Windows" },
  { port: 4369, protocol: "TCP", service: "EPMD", description: "Erlang port mapper" },
  { port: 5060, protocol: "TCP/UDP", service: "SIP", description: "Session Initiation Protocol, VoIP" },
  { port: 5432, protocol: "TCP", service: "PostgreSQL", description: "PostgreSQL database" },
  { port: 5672, protocol: "TCP", service: "AMQP", description: "RabbitMQ message broker" },
  { port: 5900, protocol: "TCP", service: "VNC", description: "Virtual Network Computing remote desktop" },
  { port: 5938, protocol: "TCP", service: "TeamViewer", description: "TeamViewer remote access" },
  { port: 6379, protocol: "TCP", service: "Redis", description: "Redis in-memory store" },
  { port: 6443, protocol: "TCP", service: "K8s API", description: "Kubernetes API server" },
  { port: 6667, protocol: "TCP", service: "IRC", description: "Internet Relay Chat alternate" },
  { port: 8000, protocol: "TCP", service: "HTTP alt", description: "Alternate HTTP, dev servers" },
  { port: 8080, protocol: "TCP", service: "HTTP proxy", description: "Proxy and alternate HTTP" },
  { port: 8443, protocol: "TCP", service: "HTTPS alt", description: "Alternate HTTPS" },
  { port: 9000, protocol: "TCP", service: "Sonar/PHP-FPM", description: "SonarQube, PHP-FPM, dev tools" },
  { port: 9090, protocol: "TCP", service: "Prometheus", description: "Prometheus metrics, Cockpit" },
  { port: 9200, protocol: "TCP", service: "Elasticsearch", description: "Elasticsearch HTTP API" },
  { port: 9300, protocol: "TCP", service: "ES cluster", description: "Elasticsearch cluster transport" },
  { port: 11211, protocol: "TCP", service: "Memcached", description: "Memcached cache server" },
  { port: 27017, protocol: "TCP", service: "MongoDB", description: "MongoDB database" },
];

const byPort = new Map(PORTS.map((p) => [p.port, p]));

export function allPorts(): PortInfo[] {
  return [...PORTS];
}

export function lookupPort(port: number): PortInfo | null {
  if (!Number.isInteger(port) || port < 0 || port > 65535) return null;
  return byPort.get(port) ?? null;
}

export function searchPorts(query: string, limit = 20): PortInfo[] {
  const q = query.trim().toLowerCase();
  if (!q) return [];
  if (/^\d+$/.test(q)) {
    const hit = byPort.get(Number(q));
    return hit ? [hit] : [];
  }
  return PORTS.filter(
    (p) => p.service.toLowerCase().includes(q) || p.description.toLowerCase().includes(q)
  ).slice(0, limit);
}

export function wellKnownRange(port: number): string {
  if (port <= 1023) return "Well-known (0-1023, IANA assigned)";
  if (port <= 49151) return "Registered (1024-49151)";
  return "Dynamic/private (49152-65535, ephemeral)";
}
