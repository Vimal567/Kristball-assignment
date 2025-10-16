import "./MetricBox.css";

const MetricBox = ({ title, value, onClick }) => {
    return (
        <div
            className={`metric-body ${onClick ? 'clickable' : ''}`}
            onClick={onClick}
            style={{ cursor: onClick ? 'pointer' : 'default' }}
        >
            <div className="heading">{title}</div>
            <div className="value">{value}</div>
        </div>
    );
};

export default MetricBox;
