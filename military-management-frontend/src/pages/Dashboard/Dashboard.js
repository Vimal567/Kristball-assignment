import { useEffect, useState } from 'react';
import "./Dashboard.css";
import MetricBox from '../../components/MetricBox/MetricBox';
import api from '../../services/api';
import { Modal, Button } from 'react-bootstrap';

export default function Dashboard({user}) {
    const assetTypeList = ["Weapon", "Vehicle", "Ammunition"];;

    const [filter, setFilter] = useState({
        date: '',
        baseId: '',
        assetType: ''
    });
    const [date, setDate] = useState(null);
    const [summary, setSummary] = useState(null);
    const [basesList, setBasesList] = useState([]);
    const [showNetModal, setShowNetModal] = useState(false);
    const [netDetails, setNetDetails] = useState(null);

    const fetchSummary = async () => {
        try {
            const data = await api.getDashboardSummary(filter);
            setSummary(data);
        } catch (err) {
            console.error(err);
            setSummary(null);
        }
    };

    const fetchBases = async () => {
        try {
            const data = await api.getBases();
            setBasesList(data);
            // If user role is not admin, set their corresponding base
            if (user.role !== "Admin") {
                setFilter((prev) => ({
                    ...prev,
                    baseId: user.baseId
                }));
            }
            fetchSummary();
        } catch (err) {
            console.error(err);
        }
    };

    const openNetDetails = () => {
        setNetDetails({
            purchases: summary?.purchases || 0,
            transfersIn: summary?.transfersIn || 0,
            transfersOut: summary?.transfersOut || 0
        });
        setShowNetModal(true);
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


    const resetFilter = () => {
        setFilter({
            date: '',
            baseId: '',
            assetType: ''
        });
        setDate('');
    };

    useEffect(() => {
        fetchBases();
    }, []);

    return (
        <div>
            <h3>Dashboard</h3>

            <div className="card mb-3">
                <div className="card-body">
                    <div className="row g-2">
                        <div className="col-md-3">
                            <label className="form-label">Date</label>
                            <input className="form-control" type='date' name="date" value={date || ''} onChange={e => handlefilterChange(e)} placeholder="Pick a date" />
                        </div>
                        <div className="col-md-3">
                            <label className="form-label">Base</label>
                            <select className="form-select" name="baseId" disabled={user.role !== "Admin"} value={filter.baseId} onChange={e => handlefilterChange(e)} placeholder="Select base">
                                <option value="" disabled>Select base</option>
                                {basesList.map((base, index) => (
                                    <option key={index} value={base._id}>{base.name}</option>
                                ))}
                            </select>
                        </div>
                        <div className="col-md-3">
                            <label className="form-label">Equipment Type</label>
                            <select className="form-select" name="assetType" value={filter.assetType} onChange={e => handlefilterChange(e)} placeholder="Select equipment type">
                                <option value="" disabled>Select equipment type</option>
                                {assetTypeList.map((type, index) => (
                                    <option key={index} value={type}>{type}</option>
                                ))}
                            </select>
                        </div>
                        <div className="col-md-3 d-flex align-items-end">
                            <button className="btn btn-primary me-2" onClick={fetchSummary}>Apply</button>
                            <button className="btn btn-secondary" onClick={resetFilter}>Reset</button>
                        </div>
                    </div>
                </div>
            </div>

            <div className="metrics-container">
                <MetricBox title="Opening Balance" value={summary?.openingBalance ?? '—'} />
                <MetricBox title="Closing Balance" value={summary?.closingBalance ?? '—'} />
                <MetricBox title="Net Movement" onClick={openNetDetails} value={summary?.netMovement ?? '—'} />
                <MetricBox title="Expended" value={summary?.expenditures ?? '—'} />
            </div>

            <Modal centered show={showNetModal} onHide={() => setShowNetModal(false)}>
                <Modal.Header closeButton><Modal.Title>Net Movement Details</Modal.Title></Modal.Header>
                <Modal.Body>
                    <p>Purchases: {netDetails?.purchases ?? 0}</p>
                    <p>Transfers In: {netDetails?.transfersIn ?? 0}</p>
                    <p>Transfers Out: {netDetails?.transfersOut ?? 0}</p>
                </Modal.Body>
                <Modal.Footer><Button variant="secondary" onClick={() => setShowNetModal(false)}>Close</Button></Modal.Footer>
            </Modal>
        </div>
    );
}
