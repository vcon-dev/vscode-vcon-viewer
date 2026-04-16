// Get the VS Code webview API
const vscode = acquireVsCodeApi();

let currentVCon = null;

// Listen for messages from the extension
window.addEventListener('message', event => {
    const message = event.data;

    switch (message.type) {
        case 'loadVCon':
            currentVCon = message.data;
            renderVCon(message.data, message.fileName);
            break;
    }
});

function renderVCon(vcon, fileName) {
    document.getElementById('no-data').style.display = 'none';
    document.getElementById('vcon-content').style.display = 'block';
    document.querySelector('.header h1').textContent = `vCon Viewer - ${fileName.split('/').pop()}`;

    renderMetadata(vcon);
    renderParties(vcon.parties || []);
    renderDialog(vcon.dialog || []);
    renderAttachments(vcon.attachments || []);
    renderAnalysis(vcon.analysis || []);
    renderJumps(vcon.jumps || []);
    renderGroups(vcon.groups || []);
    renderSigning(vcon.signing || []);
    renderEncryption(vcon.encryption || []);
}

function renderMetadata(vcon) {
    const metadataContainer = document.getElementById('metadata');
    metadataContainer.innerHTML = '';

    const metadata = [
        { label: 'vCon Version', value: vcon.vcon },
        { label: 'UUID', value: vcon.uuid },
        { label: 'Created', value: formatDate(vcon.created) },
        { label: 'Updated', value: vcon.updated ? formatDate(vcon.updated) : 'Not specified' },
        { label: 'Subject', value: vcon.subject || 'Not specified' },
        { label: 'Redacted', value: vcon.redacted ? vcon.redacted.join(', ') : 'None' },
        // 0.4.0: amended (replaced appended)
        { label: 'Amended', value: vcon.amended ? vcon.amended.join(', ') : 'None' }
    ];

    metadata.forEach(item => {
        const div = document.createElement('div');
        div.className = 'metadata-item';
        div.innerHTML = `
            <div class="metadata-label">${item.label}</div>
            <div class="metadata-value">${item.value}</div>
        `;
        metadataContainer.appendChild(div);
    });
}

function renderParties(parties) {
    const container = document.getElementById('parties');
    container.innerHTML = '';

    if (parties.length === 0) {
        container.innerHTML = '<div class="no-data">No parties defined</div>';
        return;
    }

    parties.forEach((party, index) => {
        const div = document.createElement('div');
        div.className = 'party-card';
        div.innerHTML = `
            <h4>${party.name || `Party ${index + 1}`}</h4>
            <p><strong>UUID:</strong> ${party.uuid}</p>
            ${party.tel ? `<p><strong>Phone:</strong> ${party.tel}</p>` : ''}
            ${party.email ? `<p><strong>Email:</strong> ${party.email}</p>` : ''}
        `;
        container.appendChild(div);
    });
}

function renderDialog(dialogs) {
    const container = document.getElementById('dialog');
    container.innerHTML = '';

    if (dialogs.length === 0) {
        container.innerHTML = '<div class="no-data">No dialog entries</div>';
        return;
    }

    dialogs.forEach((dialog, index) => {
        const div = document.createElement('div');
        div.className = 'dialog-item';

        let bodyContent = '';
        if (dialog.body) {
            if (dialog.mimetype && dialog.mimetype.includes('audio')) {
                bodyContent = `<audio controls><source src="${dialog.body}" type="${dialog.mimetype}">Your browser does not support audio.</audio>`;
            } else {
                bodyContent = `<div class="dialog-body">${escapeHtml(dialog.body)}</div>`;
            }
        }

        // 0.4.0: critical flag (was must_support)
        const criticalBadge = dialog.critical
            ? `<span class="badge badge-critical" title="Critical — must be understood by consumers">CRITICAL</span>`
            : '';

        // 0.4.0: session_id
        const sessionId = dialog.session_id
            ? `<p><strong>Session:</strong> local=${dialog.session_id.local} remote=${dialog.session_id.remote}</p>`
            : '';

        // encoding
        const encoding = dialog.encoding
            ? `<p><strong>Encoding:</strong> ${dialog.encoding}</p>`
            : '';

        div.innerHTML = `
            <div class="dialog-header">
                <div>
                    <span class="dialog-type">${dialog.type}</span>
                    ${criticalBadge}
                </div>
                <span>${dialog.start ? formatDate(dialog.start) : 'No start time'}</span>
            </div>
            <p><strong>UUID:</strong> ${dialog.uuid}</p>
            ${dialog.end ? `<p><strong>End:</strong> ${formatDate(dialog.end)}</p>` : ''}
            ${dialog.duration ? `<p><strong>Duration:</strong> ${dialog.duration}s</p>` : ''}
            ${dialog.parties ? `<p><strong>Parties:</strong> ${dialog.parties.join(', ')}</p>` : ''}
            ${sessionId}
            ${encoding}
            ${bodyContent}
        `;
        container.appendChild(div);
    });
}

function renderAttachments(attachments) {
    const container = document.getElementById('attachments');
    container.innerHTML = '';

    if (attachments.length === 0) {
        container.innerHTML = '<div class="no-data">No attachments</div>';
        return;
    }

    attachments.forEach(attachment => {
        const div = document.createElement('div');
        div.className = 'attachment-item';
        div.innerHTML = `
            <div>
                <strong>${attachment.filename || attachment.uuid}</strong>
                <br>
                <!-- 0.4.0: purpose (renamed from type) -->
                <small>${attachment.purpose} - ${attachment.mimetype || 'Unknown type'}</small>
                ${attachment.encoding ? `<br><small>Encoding: ${attachment.encoding}</small>` : ''}
                ${attachment.size ? `<br><small>Size: ${formatBytes(attachment.size)}</small>` : ''}
            </div>
            <button class="btn" onclick="downloadAttachment('${attachment.uuid}')">Download</button>
        `;
        container.appendChild(div);
    });
}

function renderAnalysis(analyses) {
    const container = document.getElementById('analysis');
    container.innerHTML = '';

    if (analyses.length === 0) {
        container.innerHTML = '<div class="no-data">No analysis data</div>';
        return;
    }

    analyses.forEach(analysis => {
        const div = document.createElement('div');
        div.className = 'dialog-item';

        // 0.4.0: vendor/product
        const provenance = [analysis.vendor, analysis.product].filter(Boolean).join(' / ');

        div.innerHTML = `
            <div class="dialog-header">
                <span class="dialog-type">${analysis.type}</span>
                ${provenance ? `<span class="provenance">${escapeHtml(provenance)}</span>` : ''}
            </div>
            <p><strong>UUID:</strong> ${analysis.uuid}</p>
            ${analysis.body ? `<div class="dialog-body">${escapeHtml(analysis.body)}</div>` : ''}
        `;
        container.appendChild(div);
    });
}

function renderJumps(jumps) {
    const container = document.getElementById('jumps');
    container.innerHTML = '';

    if (jumps.length === 0) {
        container.innerHTML = '<div class="no-data">No jumps defined</div>';
        return;
    }

    jumps.forEach(jump => {
        const div = document.createElement('div');
        div.className = 'party-card';
        div.innerHTML = `
            <h4>Jump ${jump.sequence || 'Unknown'}</h4>
            <p><strong>UUID:</strong> ${jump.uuid}</p>
            ${jump.start ? `<p><strong>Start:</strong> ${formatDate(jump.start)}</p>` : ''}
            ${jump.end ? `<p><strong>End:</strong> ${formatDate(jump.end)}</p>` : ''}
            ${jump.duration ? `<p><strong>Duration:</strong> ${jump.duration}s</p>` : ''}
        `;
        container.appendChild(div);
    });
}

function renderGroups(groups) {
    const container = document.getElementById('groups');
    container.innerHTML = '';

    if (groups.length === 0) {
        container.innerHTML = '<div class="no-data">No groups defined</div>';
        return;
    }

    groups.forEach(group => {
        const div = document.createElement('div');
        div.className = 'party-card';
        div.innerHTML = `
            <h4>${group.name || 'Unnamed Group'}</h4>
            <p><strong>UUID:</strong> ${group.uuid}</p>
            ${group.parties ? `<p><strong>Parties:</strong> ${group.parties.join(', ')}</p>` : ''}
        `;
        container.appendChild(div);
    });
}

function renderSigning(signing) {
    const container = document.getElementById('signing');
    container.innerHTML = '';

    if (signing.length === 0) {
        container.innerHTML = '<div class="no-data">No signing data</div>';
        return;
    }

    signing.forEach(sign => {
        const div = document.createElement('div');
        div.className = 'party-card';
        div.innerHTML = `
            <h4>${sign.type} Signing</h4>
            <p><strong>UUID:</strong> ${sign.uuid}</p>
            ${sign.body ? `<div class="dialog-body">${escapeHtml(sign.body)}</div>` : ''}
        `;
        container.appendChild(div);
    });
}

function renderEncryption(encryption) {
    const container = document.getElementById('encryption');
    container.innerHTML = '';

    if (encryption.length === 0) {
        container.innerHTML = '<div class="no-data">No encryption data</div>';
        return;
    }

    encryption.forEach(enc => {
        const div = document.createElement('div');
        div.className = 'party-card';
        div.innerHTML = `
            <h4>${enc.type} Encryption</h4>
            <p><strong>UUID:</strong> ${enc.uuid}</p>
            ${enc.body ? `<div class="dialog-body">${escapeHtml(enc.body)}</div>` : ''}
        `;
        container.appendChild(div);
    });
}

// Utility functions
function formatDate(dateString) {
    try {
        return new Date(dateString).toLocaleString();
    } catch (e) {
        return dateString;
    }
}

function formatBytes(bytes) {
    if (bytes === 0) { return '0 Bytes'; }
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

function exportVCon(format) {
    vscode.postMessage({ type: 'exportVCon', format: format });
}

function downloadAttachment(uuid) {
    const attachment = currentVCon.attachments.find(a => a.uuid === uuid);
    if (attachment) {
        vscode.postMessage({ type: 'downloadAttachment', attachment: attachment });
    }
}
