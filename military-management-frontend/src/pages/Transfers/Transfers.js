import { useEffect, useState } from 'react';
import api from '../../services/api';
import { Modal } from 'react-bootstrap';

export default function Transfers({ user }) {

    const [transfers, setTransfers] = useState([]);
    const [assetsList, setAssetsList] = useState([]);
    const [basesList, setBasesList] = useState([]);
    const [showTransferModal, setShowTransferModal] = useState(false);
    const [transferEntry, setTransferEntry] = useState({
        assetId: '',
        fromBaseId: '',
        toBaseId: '',
        quantity: 1
    });


    const fetchTransfers = async () => {
        try {
            const data = await api.getTransfers();
            setTransfers(data);
            fetchAssets();
            fetchBases();
        } catch (err) { console.error(err); }
    };

    const fetchAssets = async () => {
        try {
            const data = await api.getAssets();
            setAssetsList(data);
        } catch (err) {
            console.error(err);
        }
    };

    const fetchBases = async () => {
        try {
            const data = await api.getBases();
            setBasesList(data);
        } catch (err) {
            console.error(err);
        }
    };

    const handleTransferEntry = (event) => {
        const { name, value } = event.target;

        setTransferEntry(prevFilter => ({
            ...prevFilter,
            [name]: value
        }));
    };

    useEffect(() => {
        fetchTransfers();
    }, []);

    const submit = async (event) => {
        event.preventDefault();
        setShowTransferModal(false);
        try {
            await api.createTransfer(transferEntry);
            setTransferEntry({
                assetId: '',
                fromBaseId: '',
                toBaseId: '',
                quantity: 1
            })
            fetchTransfers();
        } catch (err) {
            console.error(err);
            alert(err.response?.data?.error || 'Failed');
        }
    };

    return (
        <div>
            <h3>Transfers</h3>

            <div className='d-flex justify-content-end'>
                <button className='btn btn-warning' onClick={() => setShowTransferModal(true)}>New Transfer</button>
            </div>
            <table className="table table-hover">
                <thead>
                    <tr>
                        <th>Asset</th>
                        <th>From</th>
                        <th>To</th>
                        <th>Qty</th>
                        <th>By</th>
                        <th>Date</th>
                    </tr>
                </thead>
                <tbody>
                    {transfers.filter(transfer => {
                        if (user.role == "Admin") {
                            return transfer;
                        } else if (transfer.fromBaseId?._id == user.baseId || transfer.toBaseId?._id == user.baseId) {
                            return transfer;
                        }
                    }).map((transfer, index) => (
                        <tr key={index}>
                            <td>{transfer.assetId?.name ?? transfer.assetId}</td>
                            <td>{transfer.fromBaseId?.name ?? transfer.fromBaseId}</td>
                            <td>{transfer.toBaseId?.name ?? transfer.toBaseId}</td>
                            <td>{transfer.quantity}</td>
                            <td>{transfer.initiatedBy?.name ?? transfer.initiatedBy}</td>
                            <td>{new Date(transfer.transferDate).toLocaleDateString('en-GB')}</td>
                        </tr>
                    ))}
                </tbody>

            </table>

            <Modal show={showTransferModal} centered onHide={() => setShowTransferModal(false)}>
                <Modal.Header closeButton><Modal.Title>Make Transer</Modal.Title></Modal.Header>
                <Modal.Body>
                    <form onSubmit={submit} className="mb-1">
                        <div className="row g-2">
                            <div>
                                <label className="form-label">Equipment</label>
                                <select className="form-select" name="assetId" value={transferEntry.assetId} onChange={handleTransferEntry} placeholder="Select base">
                                    <option value="" disabled>Select base</option>
                                    {assetsList.map((asset, index) => (
                                        <option key={index} value={asset._id}>{asset.name}</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="form-label">From Base</label>
                                <select className="form-select" name="fromBaseId" value={transferEntry.fromBaseId} onChange={handleTransferEntry} placeholder="Select base">
                                    <option value="" disabled>Select base</option>
                                    {basesList.map((base, index) => (
                                        <option key={index} value={base._id}>{base.name}</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="form-label">To Base</label>
                                <select className="form-select" name="toBaseId" value={transferEntry.toBaseId} onChange={handleTransferEntry} placeholder="Select base">
                                    <option value="" disabled>Select base</option>
                                    {basesList.map((base, index) => (
                                        <option key={index} value={base._id}>{base.name}</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="form-label">Quantity</label>
                                <input type="number" name='quantity' min="1" className="form-control" value={transferEntry.quantity} onChange={handleTransferEntry} />
                            </div>
                            <div className="d-flex justify-content-center mt-3">
                                <button className="btn btn-success" type="submit">Transfer</button>
                            </div>
                        </div>
                    </form>
                </Modal.Body>
            </Modal>
        </div>
    );
}
