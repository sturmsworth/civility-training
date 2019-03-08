import React from 'react'
import Logo from './gmail-capitolREDback.jpg'
import './PrintCertificate.css'

const PrintCertificate = ({ userName, completionDate, certID }) => (
    <div id="box" className="container-fluid">
        <div id="nice-border">
            <div className="row">
                <div className="col-12">
                    <div id="sov-logo">
                        <img src={Logo} alt="Logo"></img>
                    </div>
                </div>
            </div>

            <div className="row">
                <div className="col-12">
                    <div id="cert-title">
                        <h1>Certificate of Completion</h1>
                    </div>
                </div>
            </div>

            <div className="row">
                <div className="col-12">
                    <div className="cert-description">
                        <h3>This certificate is presented to</h3>
                    </div>
                </div>
            </div>

            <div className="row">
                <div className="col-12">
                    <div className="cert-bold">
                        <h1>{userName}</h1>
                    </div>
                </div>
            </div>

            <div className="row">
                <div className="col-12">
                    <div className="cert-description">
                        <h3>for completion of the Senate of Virginia's</h3>
                    </div>
                </div>
            </div>

            <div className="row">
                <div className="col-12">
                    <div className="cert-bold">
                        <h1>Workplace Civility Training</h1>
                    </div>
                </div>
            </div>

            <div className="row">
                <div className="col-12">
                    <div className="cert-description">
                        <h3>{completionDate}</h3>
                    </div>
                </div>
            </div>

            <div className="row">
                <div className="col-12">
                    <div id="line">
                        <hr></hr>
                    </div>
                </div>
            </div>

            <div className="row">
                <div className="col-12">
                    <div id="serial">
                        <p>Certificate # <b>
                            {
                                certID.slice(117, 129)
                            }
                            </b> 
                        </p>
                    </div>
                </div>
            </div>
        </div>
    </div>
)

export default PrintCertificate