import React from 'react';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

interface TimetableProps {
  schedule: any;
  timing: {
    startTime: string;
    endTime: string;
    breakStart: string;
    breakEnd: string;
  };
}

export default function TimetableView({ schedule, timing }: TimetableProps) {
  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
  const startHour = parseInt(timing.startTime.split(':')[0]);
  const endHour = parseInt(timing.endTime.split(':')[0]);
  const breakStartHour = parseInt(timing.breakStart.split(':')[0]);

  const hours = Array.from(
    { length: endHour - startHour },
    (_, i) => startHour + i
  );

  const handleDownload = () => {
    const doc = new jsPDF();

    // Add title
    doc.setFontSize(16);
    doc.text('Weekly Timetable', 14, 15);

    // Add timing information
    doc.setFontSize(10);
    doc.text(`Institute Hours: ${timing.startTime} - ${timing.endTime}`, 14, 25);
    doc.text(`Break Time: ${timing.breakStart} - ${timing.breakEnd}`, 14, 30);

    // Prepare table data
    const tableHeaders = ['Day', ...hours.map(hour => 
      `${hour}:00 - ${hour + 1}:00${hour === breakStartHour ? '\n(Break)' : ''}`
    )];
    
    const tableData = days.map(day => {
      const rowData = [day];
      hours.forEach(hour => {
        const cellContent = schedule?.[day]?.[hour] || (hour === breakStartHour ? 'Break' : '-');
        rowData.push(cellContent);
      });
      return rowData;
    });

    // Add table
    (doc as any).autoTable({
      head: [tableHeaders],
      body: tableData,
      startY: 35,
      styles: {
        fontSize: 8,
        cellPadding: 2,
      },
      headStyles: {
        fillColor: [63, 81, 181],
        textColor: 255,
        fontSize: 8,
        fontStyle: 'bold',
      },
      columnStyles: {
        0: { cellWidth: 25 }, // Day column
        ...Object.fromEntries(
          hours.map((_, i) => [i + 1, { cellWidth: 'auto' }])
        ),
      },
      alternateRowStyles: {
        fillColor: [245, 245, 245],
      },
      didParseCell: function(data: any) {
        // Highlight break column
        if (data.column.index > 0) {
          const hour = startHour + data.column.index - 1;
          if (hour === breakStartHour) {
            data.cell.styles.fillColor = [224, 224, 224];
          }
        }
      },
    });

    // Save PDF
    doc.save('timetable.pdf');
  };

  return (
    <div className="mt-8">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold text-gray-900">Weekly Timetable</h2>
        <button
          onClick={handleDownload}
          className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
        >
          Download PDF
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Day
              </th>
              {hours.map((hour) => (
                <th
                  key={hour}
                  className={`px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider ${
                    hour === breakStartHour ? 'bg-gray-100' : ''
                  }`}
                >
                  {`${hour}:00 - ${hour + 1}:00`}
                  {hour === breakStartHour && (
                    <span className="block text-gray-400">(Break)</span>
                  )}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {days.map((day) => (
              <tr key={day}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {day}
                </td>
                {hours.map((hour) => (
                  <td
                    key={hour}
                    className={`px-6 py-4 whitespace-nowrap text-sm text-gray-500 ${
                      hour === breakStartHour ? 'bg-gray-100' : ''
                    }`}
                  >
                    {schedule?.[day]?.[hour] || (hour === breakStartHour ? 'Break' : '-')}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}