import { useEffect, useState } from 'react';
import "./Purchases.css";
import api from '../../services/api';
import { Modal } from 'react-bootstrap';

export default function Purchases() {
    const assetTypeList = ["Weapon", "Vehicle", "Ammunition"];;

    const [filter, setFilter] = useState({
        date: '',
        assetType: ''
    });
    const [purchaseEntry, setPurchaseEntry] = useState({
        assetId: '',
        baseId: '',
        quantity: 1
    });
    const [date, setDate] = useState('');
    const [purchases, setPurchases] = useState([]);
    const [assetsList, setAssetsList] = useState([]);
    const [basesList, setBasesList] = useState([]);
    const [showPurchaseModal, setShowPurchaseModal] = useState(false);


    const fetchPurchases = async () => {
        try {
            const data = await api.getPurchases(filter);
            setPurchases(data);
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

    const submit = async (event) => {
        event.preventDefault();
        setShowPurchaseModal(false);
        try {
            await api.createPurchase(purchaseEntry);
            setPurchaseEntry({
                assetId: '',
                baseId: '',
                quantity: 1
            });
            fetchPurchases();
        } catch (err) {
            console.error(err);
            alert(err.response?.data?.error || 'Failed');
        }
    };

    const handlefilterChange = (event) => {
        const { name, value } = event.target;

        // Formatting date to match backend query MM/DD/YYYY
        let formattedValue = value;

        if (name === 'date' && value) {
            setDate(value);
            const [year, month, day] = value.split('-');
            formattedValue = `${month}/${day}/${year}`;
        }

        setFilter(prevFilter => ({
            ...prevFilter,
            [name]: formattedValue
        }));
    };

    const handlePurchaseEntry = (event) => {
        const { name, value } = event.target;

        setPurchaseEntry(prevFilter => ({
            ...prevFilter,
            [name]: value
        }));
    };

    const resetFilter = () => {
        setFilter({
            date: '',
            assetType: ''
        });
        setDate('');
    };

    useEffect(() => {
        fetchPurchases();
    }, []);

    return (
        <div>
            <h3>Purchases</h3>
            <div className="card mb-3">
                <div className="card-body">
                    <div className="row g-2">
                        <div className="col-md-3">
                            <label className="form-label">Date</label>
                            <input
                                className="form-control"
                                type="date"
                                name="date"
                                value={date || ""}
                                onChange={(e) => handlefilterChange(e)}
                                placeholder="Pick a date"
                            />
                        </div>
                        <div className="col-md-3">
                            <label className="form-label">Equipment Type</label>
                            <select
                                className="form-select"
                                name="assetType"
                                value={filter.assetType}
                                onChange={(e) => handlefilterChange(e)}
                                placeholder="Select equipment type"
                            >
                                <option value="" disabled>
                                    Select equipment type
                                </option>
                                {assetTypeList.map((type, index) => (
                                    <option key={index} value={type}>
                                        {type}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className="col-md-3 d-flex align-items-end">
                            <button
                                className="btn btn-primary me-2"
                                onClick={fetchPurchases}
                            >
                                Apply
                            </button>
                            <button className="btn btn-secondary" onClick={resetFilter}>
                                Reset
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <div className='d-flex justify-content-between'>
                <h5>History</h5>
                <button className='btn btn-warning' onClick={() => setShowPurchaseModal(true)}>New Purchase</button>
            </div>
            <div className='responsive-table'>
                <table className="table table-striped">
                    <thead>
                        <tr>
                            <th>Equipment Name</th>
                            <th>Equipment Type</th>
                            <th>Base</th>
                            <th>Quantity</th>
                            <th>Added By</th>
                            <th>Date</th>
                        </tr>
                    </thead>
                    <tbody>
                        {purchases.map((p) => (
                            <tr key={p._id}>
                                <td>{p.assetId?.name ?? p.assetId}</td>
                                <td>{p.assetId?.type ?? p.assetId}</td>
                                <td>{p.baseId?.name ?? p.baseId}</td>
                                <td>{p.quantity}</td>
                                <td>{p.addedBy?.name ?? p.addedBy}</td>
                                <td>{new Date(p.purchaseDate).toLocaleDateString('en-GB')}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <Modal show={showPurchaseModal} centered onHide={() => setShowPurchaseModal(false)}>
                <Modal.Header closeButton><Modal.Title>Make Purchase</Modal.Title></Modal.Header>
                <Modal.Body>
                    <form onSubmit={submit} className="mb-1">
                        <div className="row g-2">
                            <div>
                                <label className="form-label">Equipment</label>
                                <select className="form-select" name="assetId" value={purchaseEntry.assetId} onChange={handlePurchaseEntry} placeholder="Select base">
                                    <option value="" disabled>Select base</option>
                                    {assetsList.map((asset, index) => (
                                        <option key={index} value={asset._id}>{asset.name}</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="form-label">Base</label>
                                <select className="form-select" name="baseId" value={purchaseEntry.baseId} onChange={handlePurchaseEntry} placeholder="Select base">
                                    <option value="" disabled>Select base</option>
                                    {basesList.map((base, index) => (
                                        <option key={index} value={base._id}>{base.name}</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="form-label">Quantity</label>
                                <input type="number" name='quantity' min="1" className="form-control" value={purchaseEntry.quantity} onChange={handlePurchaseEntry} />
                            </div>
                            <div className="d-flex justify-content-center mt-3">
                                <button className="btn btn-success" type="submit">Create Purchase</button>
                            </div>
                        </div>
                    </form>
                </Modal.Body>
            </Modal>
        </div>
    );
}
