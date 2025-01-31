// Global variables
let secretClient = null;
const SWAP_CONTRACT = "secret1testcontract..."; // Use any testnet address
const CODE_HASH = "abc123"; // Any dummy hash

// Smooth scroll to sections
function scrollToSection(sectionId) {
    document.getElementById(sectionId).scrollIntoView({
        behavior: 'smooth'
    });
}

// Wallet connection handler - UPDATED VERSION
async function connectWallet() {
    try {
        if (!window.keplr) {
            alert("Please install Keplr Wallet!");
            return;
        }
        
        await window.keplr.enable('secret-4');
        const offlineSigner = window.getOfflineSigner('secret-4');
        
        // Initialize Secret client
        secretClient = new SecretNetworkClient({
            url: 'https://lcd.secret.express',
            chainId: 'secret-4',
            wallet: offlineSigner
        });

        // Update UI
        document.getElementById('walletStatus').innerHTML = `
            <span class="connected">
                ${secretClient.address.slice(0, 6)}...${secretClient.address.slice(-4)}
            </span>
        `;
        document.getElementById('swapButton').disabled = false;
        initSwapInterface();
        
    } catch (error) {
        console.error("Wallet connection failed:", error);
        alert("Connection failed: " + error.message);
    }
}

// Swap functionality - ADD THESE NEW FUNCTIONS
function initSwapInterface() {
    document.getElementById('inputAmount').addEventListener('input', updateOutput);
}

async function updateOutput() {
    const input = document.getElementById('inputAmount').value;
    if (!input || input <= 0) {
        document.getElementById('outputAmount').value = '';
        return;
    }

    try {
        const rate = await getSwapRate();
        document.getElementById('outputAmount').value = (input * rate).toFixed(4);
    } catch (error) {
        console.error("Rate calculation failed:", error);
        document.getElementById('outputAmount').value = 'Error';
    }
}

async function getSwapRate() {
    // Replace with actual contract query
    return 0.98; // Mock rate with 2% fee
}

function switchTokens() {
    const inputToken = document.getElementById('inputToken');
    const outputToken = document.getElementById('outputToken');
    [inputToken.value, outputToken.value] = [outputToken.value, inputToken.value];
    updateOutput();
}

async function executeSwap() {
    const inputAmount = document.getElementById('inputAmount').value;
    if (!inputAmount || inputAmount <= 0) {
        alert("Enter a valid amount");
        return;
    }

    try {
        const swapMsg = {
            swap: {
                input_token: document.getElementById('inputToken').value,
                output_token: document.getElementById('outputToken').value,
                amount: (inputAmount * 1e6).toString(), // SCRT uses 6 decimals
                recipient: secretClient.address
            }
        };

        const tx = await secretClient.tx.compute.executeContract({
            sender: secretClient.address,
            contract_address: SWAP_CONTRACT,
            msg: swapMsg,
            code_hash: CODE_HASH
        });

        alert(`Swap successful!\nTX Hash: ${tx.transactionHash}`);
    } catch (error) {
        console.error("Swap failed:", error);
        alert(`Swap failed: ${error.message}`);
    }
}

// Initialize animations - EXISTING CODE
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
