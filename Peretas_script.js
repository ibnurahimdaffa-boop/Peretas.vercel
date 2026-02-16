// Hacker IP Detector - Script
class HackerDetector {
    constructor() {
        this.targetInput = document.getElementById('targetInput');
        this.startBtn = document.getElementById('startBtn');
        this.scanStatus = document.getElementById('scanStatus');
        this.resultsContent = document.getElementById('resultsContent');
        this.loadingIndicator = document.getElementById('loadingIndicator');
        
        this.initEventListeners();
    }
    
    initEventListeners() {
        this.startBtn.addEventListener('click', () => this.startScan());
        this.targetInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.startScan();
            }
        });
    }
    
    async startScan() {
        const targetUrl = this.targetInput.value.trim();
        
        if (!targetUrl) {
            this.showStatus('⚠️ Masukkan URL target terlebih dahulu!', 'error');
            return;
        }
        
        if (!this.isValidUrl(targetUrl)) {
            this.showStatus('⚠️ URL tidak valid! Gunakan format https://example.com', 'error');
            return;
        }
        
        // Reset tampilan
        this.showStatus('🔍 Memulai scanning...', 'info');
        this.showLoading(true);
        this.resultsContent.innerHTML = '';
        
        try {
            // Simulasi proses scanning
            await this.sleep(1500);
            
            // Generate dummy data untuk demo
            const scanResults = this.generateDummyResults(targetUrl);
            
            // Tampilkan hasil
            this.displayResults(scanResults);
            this.showStatus('✅ Scan selesai! Ditemukan ' + scanResults.suspicious_ips.length + ' IP mencurigakan', 'success');
            
        } catch (error) {
            this.showStatus('❌ Error saat scanning: ' + error.message, 'error');
            this.displayError(error);
        } finally {
            this.showLoading(false);
        }
    }
    
    isValidUrl(url) {
        try {
            new URL(url);
            return true;
        } catch {
            return false;
        }
    }
    
    generateDummyResults(targetUrl) {
        // Dummy data untuk demo
        const suspiciousIPs = [
            { ip: '185.142.53.12', country: 'RU', requests: 1547, threats: ['SQL Injection', 'Port Scan'], risk: 'high' },
            { ip: '103.145.89.34', country: 'CN', requests: 892, threats: ['Brute Force', 'XSS'], risk: 'high' },
            { ip: '45.155.205.68', country: 'NL', requests: 445, threats: ['DDoS Attempt'], risk: 'medium' },
            { ip: '197.210.78.91', country: 'NG', requests: 234, threats: ['Path Traversal'], risk: 'medium' },
            { ip: '91.92.145.33', country: 'TR', requests: 167, threats: ['Bot Activity'], risk: 'low' },
            { ip: '178.62.101.45', country: 'GB', requests: 98, threats: ['Directory Scanning'], risk: 'low' }
        ];
        
        const cleanIPs = [
            { ip: '8.8.8.8', country: 'US', requests: 23 },
            { ip: '1.1.1.1', country: 'AU', requests: 15 },
            { ip: '208.67.222.222', country: 'US', requests: 8 }
        ];
        
        return {
            target: targetUrl,
            scan_time: new Date().toISOString(),
            total_requests: 3483,
            unique_ips: 156,
            suspicious_ips: suspiciousIPs,
            clean_ips: cleanIPs,
            recommendations: [
                'Blokir IP dari Russia (185.142.53.12) - Terdeteksi SQL Injection',
                'Tambahkan WAF untuk mencegah Brute Force',
                'Rate limiting untuk IP China',
                'Update firewall rules'
            ]
        };
    }
    
    displayResults(results) {
        let html = `
            <div class="result-item">
                <div style="color: #00f3ff; margin-bottom: 15px;">
                    ⚡ TARGET: ${results.target}
                </div>
                <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px; margin-bottom: 20px;">
                    <div class="detail-tag">Total Requests</div>
                    <div class="detail-tag">Unique IPs</div>
                    <div class="detail-tag">Suspicious</div>
                    <div class="detail-value">${results.total_requests}</div>
                    <div class="detail-value">${results.unique_ips}</div>
                    <div class="detail-value threat-high">${results.suspicious_ips.length}</div>
                </div>
            </div>
        `;
        
        // Tampilkan IP mencurigakan
        if (results.suspicious_ips.length > 0) {
            html += '<div class="result-item"><div style="color: #ff4444; margin-bottom: 15px;">🔥 SUSPICIOUS IPS DETECTED:</div>';
            
            results.suspicious_ips.forEach(ip => {
                const threatClass = ip.risk === 'high' ? 'threat-high' : (ip.risk === 'medium' ? 'threat-medium' : 'threat-low');
                
                html += `
                    <div style="margin: 15px 0; padding: 10px; border: 1px solid #00f3ff; border-radius: 15px;">
                        <div class="ip-address ${threatClass}">🔴 ${ip.ip} (${ip.country})</div>
                        <div class="ip-details">
                            <span class="detail-tag">Requests:</span>
                            <span class="detail-value">${ip.requests}</span>
                            <span class="detail-tag">Threats:</span>
                            <span class="detail-value">${ip.threats.join(', ')}</span>
                        </div>
                    </div>
                `;
            });
            
            html += '</div>';
        }
        
        // Tampilkan rekomendasi
        html += `
            <div class="result-item">
                <div style="color: #00f3ff; margin-bottom: 15px;">📋 RECOMMENDATIONS:</div>
                <ul style="list-style: none; padding-left: 0;">
                    ${results.recommendations.map(rec => `
                        <li style="margin: 10px 0; padding-left: 20px; border-left: 2px solid #00f3ff;">
                            ${rec}
                        </li>
                    `).join('')}
                </ul>
            </div>
        `;
        
        this.resultsContent.innerHTML = html;
    }
    
    displayError(error) {
        this.resultsContent.innerHTML = `
            <div class="result-item" style="border-color: #ff4444;">
                <div style="color: #ff4444; font-size: 18px; margin-bottom: 15px;">
                    ⚠️ SCAN ERROR
                </div>
                <div style="color: #ffffff;">
                    ${error.message || 'Terjadi kesalahan saat scanning'}
                </div>
                <div style="color: #00f3ff; margin-top: 15px;">
                    Pastikan URL valid dan target dapat diakses
                </div>
            </div>
        `;
    }
    
    showStatus(message, type = 'info') {
        this.scanStatus.textContent = message;
        this.scanStatus.style.color = type === 'error' ? '#ff4444' : 
                                      (type === 'success' ? '#00ff00' : '#00f3ff');
    }
    
    showLoading(show) {
        this.loadingIndicator.style.display = show ? 'flex' : 'none';
    }
    
    sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}

// Inisialisasi saat halaman dimuat
document.addEventListener('DOMContentLoaded', () => {
    new HackerDetector();
});
