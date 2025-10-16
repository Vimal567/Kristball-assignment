import { useEffect, useState } from 'react';
import api from '../../services/api';
import { Modal } from 'react-bootstrap';

export default function Expenditures({ user }) {

    const [expenditures, setExpenditures] = useState([]);
    const [assetsList, setAssetsList] = useState([]);
    const [basesList, setBasesList] = useState([]);
    const [expenditureEntry, setExpenditureEntry] = useState({
        assignedTo: '',
        assetId: '',
        baseId: '',
        quantity: 1,
        reason: 'Used'
    });
    const [showExpenditureModal, setshowExpenditureModal] = useState(false);

    const fetchExpeditures = async () => {
        try {
            const data = await api.getExpenditures();
            setExpenditures(data);
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

    const handleExpenditureEntry = (event) => {
        const { name, value } = event.target;

        setExpenditureEntry(prevFilter => ({
            ...prevFilter,
            [name]: value
        }));
    };

    const submit = async (event) => {
        event.preventDefault();
        setshowExpenditureModal(false);
        try {
            await api.createExpenditure(expenditureEntry);
            setExpenditureEntry({
                assignedTo: '',
                assetId: '',
                baseId: '',
                quantity: 1,
                reason: 'Used'
            });
            fetchExpeditures();
        } catch (err) {
            console.error(err);
            alert(err.response?.data?.error || 'Failed');
        }
    };

    useEffect(() => {
        fetchExpeditures();
    }, []);

    return (
        <div>
            <h3>Expenditures</h3>

            <div className='d-flex justify-content-end'>
                <button className='btn btn-warning' onClick={() => setshowExpenditureModal(true)}>New Expenditure</button>
            </div>
            <table className="table table-sm">
                <thead>
                    <tr>
                        <th>Asset</th>
                        <th>Base</th>
                        <th>Qty</th>
                        <th>Reason</th>
                        <th>Date</th>
                    </tr>
                </thead>
                <tbody>
                    {expenditures.filter(expenditure => {
                        console.log(expenditure.baseId?._id)
                        if (user.role == "Admin") {
                            return expenditure;
                        } else if (expenditure.baseId?._id == user.baseId) {
                            return expenditure;
                        }
                    }).map((expenditure, index) => (
                        <tr key={index}>
                            <td>{expenditure.assetId?.name ?? expenditure.assetId}</td>
                            <td>{expenditure.baseId?.name ?? expenditure.baseId}</td>
                            <td>{expenditure.quantity}</td>
                            <td>{expenditure.reason}</td>
                            <td>{new Date(expenditure.dateExpended).toLocaleDateString('en-GB')}</td>
                        </tr>
                    ))}
                </tbody>

            </table>

            <Modal show={showExpenditureModal} centered onHide={() => setshowExpenditureModal(false)}>
                <Modal.Header closeButton><Modal.Title>Create Expenditure</Modal.Title></Modal.Header>
                <Modal.Body>
                    <form onSubmit={submit} className="mb-1">
                        <div className="row g-2">
                            <div>
                                <label className="form-label">Name</label>
                                <input type="text" name='assignedTo' minLength="3" className="form-control" value={expenditureEntry.assignedTo} onChange={handleExpenditureEntry} />
                            </div>
                            <div>
                                <label className="form-label">Equipment</label>
                                <select className="form-select" name="assetId" value={expenditureEntry.assetId} onChange={handleExpenditureEntry} placeholder="Select base">
                                    <option value="" disabled>Select base</option>
                                    {assetsList.map((asset, index) => (
                                        <option key={index} value={asset._id}>{asset.name}</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="form-label">Base</label>
                                <select className="form-select" name="baseId" value={expenditureEntry.baseId} onChange={handleExpenditureEntry} placeholder="Select base">
                                    <option value="" disabled>Select base</option>
                                    {basesList.map((base, index) => (
                                        <option key={index} value={base._id}>{base.name}</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="form-label">Quantity</label>
                                <input type="number" name='quantity' min="1" className="form-control" value={expenditureEntry.quantity} onChange={handleExpenditureEntry} />
                            </div>
                            <div>
                                <label className="form-label">Reason</label>
                                <select className="form-select" name='reason' value={expenditureEntry.reason} onChange={handleExpenditureEntry}>
                                    <option>Used</option>
                                    <option>Damaged</option>
                                    <option>Expired</option>
                                </select>
                            </div>
                            <div className="d-flex justify-content-center mt-3">
                                <button className="btn btn-success" type="submit">Record Expenditure</button>
                            </div>
                        </div>
                    </form>
                </Modal.Body>
            </Modal>
        </div>
    );
}
