import React from 'react'
import Logo from './capitolREDback.jpg'
import './PrintCertificate.css'

const PrintCertificate = ({ firstName, lastName, completionDate, certID, division }) => (
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
                        <h1>{`${firstName} ${lastName}`}</h1>
                    </div>
                </div>
            </div>

            <div className="row">
                <div className="col-12">
                    <div className="cert-description">
                        <h3>for completion of the {division}'s</h3>
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

            <div className="row">
                <div className="col-12">
                    <div id="print-me">
                        <button className="btn btn-lg btn-success" onClick={
                                () => {
                                    window.print()
                                }
                            }>Print</button>
                    </div>
                </div>
            </div>
        </div>
    </div>
)

export default PrintCertificate