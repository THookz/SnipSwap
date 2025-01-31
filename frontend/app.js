// Smooth scroll to sections
function scrollToSection(sectionId) {
    document.getElementById(sectionId).scrollIntoView({
        behavior: 'smooth'
    });
}

// Wallet connection handler
async function connectWallet() {
    try {
        if (!window.keplr) {
            alert("Please install Keplr Wallet!");
            return;
        }
        
        await window.keplr.enable('secret-4');
        const offlineSigner = window.getOfflineSigner('secret-4');
        
        // Initialize Secret client
        const secretClient = new SecretNetworkClient({
            url: 'https://lcd.secret.express',
            chainId: 'secret-4',
            wallet: offlineSigner
        });
        
        alert("Wallet connected: " + secretClient.address);
    } catch (error) {
        console.error("Wallet connection failed:", error);
    }
}

// Initialize animations
document.addEventListener('DOMContentLoaded', () => {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = 1;
                entry.target.style.transform = 'translateY(0)';
            }
        });
    });

    document.querySelectorAll('.feature-card').forEach(card => {
        card.style.opacity = 0;
        card.style.transform = 'translateY(20px)';
        observer.observe(card);
    });
});
