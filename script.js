/* 
Ougaba Gray
2405837
CIT2011 – Graded Lab 3
*/

// get important elements from html
const form = document.getElementById('receiptForm');
const preview = document.querySelector('.slip-body');
const savedHeading = document.querySelector('.saved-heading');
let receipts = JSON.parse(localStorage.getItem('receipts')) || [];

// check if required fields are filled
function validateForm() {
    let fields = form.querySelectorAll('[required]');
    for (let i = 0; i < fields.length; i++) {
        if (fields[i].value.trim() === '') {
            alert('Please fill out all required fields!');
            fields[i].focus();
            return false;
        }
    }
    return true;
}

// show generated receipt info in the right panel 
function generateReceipt() {
    if (!validateForm()) return;
    let data = new FormData(form);
    let info = {};
    data.forEach((v, k) => info[k] = v);

    // Display all form data in preview
    preview.innerHTML = `
        <p><b>Tenant:</b> ${info.tenant}</p>
        <p><b>Landlord:</b> ${info.landlord}</p>
        <p><b>Email:</b> ${info.email || 'N/A'}</p>
        <p><b>Phone:</b> ${info.phone || 'N/A'}</p>
        <p><b>Address:</b> ${info.address} ${info.unit ? 'Unit ' + info.unit : ''}</p>
        <p><b>Amount:</b> $${parseFloat(info.amount || 0).toFixed(2)}</p>
        <p><b>Payment Method:</b> ${info.method}</p>
        <p><b>Payment Date:</b> ${info.payDate}</p>
        <p><b>Rent Period:</b> ${info.from} to ${info.to}</p>
        <p><b>Receipt No:</b> ${info.receiptId}</p>
        ${info.notes ? `<p><b>Notes:</b> ${info.notes}</p>` : ''}
        ${info.signature ? `<p><b>Signature:</b> ${info.signature}</p>` : ''}
    `;
    alert('Receipt created!');
}

// print the receipt
function printReceipt() {
    let content = document.querySelector('.slip').innerHTML;
    let w = window.open('', '', 'width=800,height=600');
    w.document.write('<html><head><style>body{font-family:monospace;padding:20px;}</style></head><body>' + content + '</body></html>');
    w.print();
    w.close();
}

// save receipt using local storage 
function saveReceipt() {
    if (!validateForm()) return;
    let data = new FormData(form);
    let info = {};
    data.forEach((v, k) => info[k] = v);
    
    // Add timestamp for unique identification
    info.timestamp = new Date().toISOString();
    
    receipts.push(info);
    localStorage.setItem('receipts', JSON.stringify(receipts));
    alert('Receipt saved!');
    
    // Refresh the saved receipts display
    displaySavedReceipts();
}

// Display saved receipts history 
function displaySavedReceipts() {
    // Create container for saved receipts if it doesn't exist
    let savedContainer = document.querySelector('.saved-receipts-container');
    
    if (!savedContainer) {
        savedContainer = document.createElement('div');
        savedContainer.className = 'saved-receipts-container';
        savedHeading.parentNode.insertBefore(savedContainer, savedHeading.nextSibling);
    }
    
    // Clear existing content
    savedContainer.innerHTML = '';
    
    if (receipts.length === 0) {
        savedContainer.innerHTML = '<p style="color: #666; font-style: italic;">No saved receipts yet.</p>';
        return;
    }
    
    // Adds the "Delete All" button
    const deleteAllBtn = document.createElement('button');
    deleteAllBtn.className = 'btn btn-danger';
    deleteAllBtn.innerHTML = '<span class="material-icons-outlined">delete_sweep</span> DELETE ALL';
    deleteAllBtn.onclick = deleteAllReceipts;
    savedContainer.appendChild(deleteAllBtn);
    
    // Display each receipt
    receipts.forEach((receipt, index) => {
        const receiptCard = document.createElement('div');
        receiptCard.className = 'saved-receipt-card';
        receiptCard.innerHTML = `
            <div class="receipt-header">
                <strong>${receipt.receiptId}</strong>
                <span class="receipt-date">${receipt.payDate}</span>
            </div>
            <div class="receipt-details">
                <p><b>Tenant:</b> ${receipt.tenant}</p>
                <p><b>Landlord:</b> ${receipt.landlord}</p>
                <p><b>Amount:</b> $${parseFloat(receipt.amount || 0).toFixed(2)}</p>
                <p><b>Address:</b> ${receipt.address}</p>
            </div>
            <div class="receipt-actions">
                <button class="btn-small btn-view" onclick="viewReceipt(${index})">
                    <span class="material-icons-outlined">visibility</span> View
                </button>
                <button class="btn-small btn-delete" onclick="deleteReceipt(${index})">
                    <span class="material-icons-outlined">delete</span> Delete
                </button>
            </div>
        `;
        savedContainer.appendChild(receiptCard);
    });
}

// View one of the saved receipt
function viewReceipt(index) {
    const receipt = receipts[index];
    
    preview.innerHTML = `
        <p><b>Tenant:</b> ${receipt.tenant}</p>
        <p><b>Landlord:</b> ${receipt.landlord}</p>
        <p><b>Email:</b> ${receipt.email || 'N/A'}</p>
        <p><b>Phone:</b> ${receipt.phone || 'N/A'}</p>
        <p><b>Address:</b> ${receipt.address} ${receipt.unit ? 'Unit ' + receipt.unit : ''}</p>
        <p><b>Amount:</b> $${parseFloat(receipt.amount || 0).toFixed(2)}</p>
        <p><b>Payment Method:</b> ${receipt.method}</p>
        <p><b>Payment Date:</b> ${receipt.payDate}</p>
        <p><b>Rent Period:</b> ${receipt.from} to ${receipt.to}</p>
        <p><b>Receipt No:</b> ${receipt.receiptId}</p>
        ${receipt.notes ? `<p><b>Notes:</b> ${receipt.notes}</p>` : ''}
        ${receipt.signature ? `<p><b>Signature:</b> ${receipt.signature}</p>` : ''}
    `;
    
    // Scroll to preview on mobile
    document.querySelector('.preview-panel').scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

// Delete a single receipt 
function deleteReceipt(index) {
    if (confirm('Are you sure you want to delete this receipt?')) {
        receipts.splice(index, 1);
        localStorage.setItem('receipts', JSON.stringify(receipts));
        alert('Receipt deleted!');
        displaySavedReceipts();
    }
}

// Delete all receipts 
function deleteAllReceipts() {
    if (confirm('Are you sure you want to delete ALL receipts? This cannot be undone!')) {
        receipts = [];
        localStorage.setItem('receipts', JSON.stringify(receipts));
        alert('All receipts deleted!');
        displaySavedReceipts();
    }
}

// Load saved receipts when page loads 
window.addEventListener('load', function() {
    displaySavedReceipts();
});

// Button event handlers
document.querySelector('.btn.solid').onclick = generateReceipt;
document.querySelector('[name="Print"]').onclick = printReceipt;
document.querySelector('[name="Save"]').onclick = saveReceipt;