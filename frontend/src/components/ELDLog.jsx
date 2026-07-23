import React from 'react';

const ELDLog = ({ days }) => {
  if (!days || days.length === 0) {
    return <div className="eld-logs">No log data available</div>;
  }

  const statusColors = {
    0: 'off-duty',
    1: 'sleeper',
    2: 'driving',
    3: 'on-duty'
  };

  const statusLabels = {
    0: 'Off Duty',
    1: 'Sleeper Berth',
    2: 'Driving',
    3: 'On Duty (Not Driving)'
  };

  return (
    <div className="eld-logs">
      {days.map((day, index) => {
        const hourStatus = day.hour_status || [];
        
        return (
          <div key={index} className="eld-log">
            <div className="eld-log-header">
              <span className="day-title">Day {day.day_number}</span>
              <span className="day-date">{day.date}</span>
            </div>
            
            <div className="eld-log-summary">
              <span className="stat">
                <span className="dot driving"></span>
                Driving: <span className="stat-value">{day.driving_hours?.toFixed(1)}h</span>
              </span>
              <span className="stat">
                <span className="dot off-duty"></span>
                Off Duty: <span className="stat-value">{day.off_duty_hours?.toFixed(1)}h</span>
              </span>
              <span className="stat">
                <span className="dot on-duty"></span>
                On Duty (ND): <span className="stat-value">{day.on_duty_not_driving_hours?.toFixed(1)}h</span>
              </span>
              <span className="stat">
                <span className="dot sleeper"></span>
                Sleeper: <span className="stat-value">{day.sleeper_berth_hours?.toFixed(1)}h</span>
              </span>
              <span className="stat">
                Total On Duty: <span className="stat-value">{day.total_on_duty_hours?.toFixed(1)}h</span>
              </span>
              <span className="stat">
                Cycle Used: <span className="stat-value">{day.cycle_used?.toFixed(1)}h</span>
              </span>
            </div>

            <div className="log-grid-wrapper">
              <table className="log-grid">
                <thead>
                  <tr className="hour-label-row">
                    <th>Status</th>
                    {[...Array(24)].map((_, i) => (
                      <th key={i}>{i}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {[0, 1, 2, 3].map(statusType => (
                    <tr key={statusType}>
                      <td className="status-label">
                        <span className={`label-dot ${statusColors[statusType]}`}></span>
                        {statusLabels[statusType]}
                      </td>
                      {[...Array(24)].map((_, hour) => {
                        const status = hourStatus[hour] ?? 0;
                        const isFilled = status === statusType;
                        return (
                          <td 
                            key={hour} 
                            className={`hour-cell ${isFilled ? `filled filled-${statusColors[statusType]}` : 'empty'}`}
                          />
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="eld-log-remarks">
              <strong>Remarks:</strong> {day.remarks || 'No remarks'}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default ELDLog;