import React from 'react';
import './ClaimCertificate.css'

const ClaimCertificate = ({ validCert, setModalState }) => (
    <div id="claim-certificate"
        className="text-center"
    >
        { !validCert ? 
            <button className="btn btn-lg btn-secondary" 
                disabled>
                Claim Certificate
            </button> :
            <button className="btn btn-lg btn-success" onClick={() => setModalState()}>
                Claim Certificate
            </button>
        }
    </div>
);

export default ClaimCertificate;