import type { DataProfileResponse } from '../types/analysis';

interface DataProfileProps {
  data: DataProfileResponse;
}

export default function DataProfile({ data }: DataProfileProps) {
  return (
    <div className="w-full max-w-6xl mx-auto space-y-6">
      {/* Header Card */}
      <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">
              {data.file_name}
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              Analyzed on {new Date(data.created_at).toLocaleString()}
            </p>
          </div>

          {/* Quality Score Badge */}
          <div className="flex flex-col items-center">
            <div className={`
              text-4xl font-bold rounded-full w-24 h-24 flex items-center justify-center
              ${data.quality_score >= 80 ? 'bg-green-100 text-green-700' :
                data.quality_score >= 60 ? 'bg-yellow-100 text-yellow-700' :
                'bg-red-100 text-red-700'}
            `}>
              {data.quality_score.toFixed(0)}
            </div>
            <p className="text-xs text-gray-600 mt-2 font-semibold">Quality Score</p>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
          <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
            <p className="text-xs text-blue-600 font-semibold uppercase">Rows</p>
            <p className="text-2xl font-bold text-blue-900 mt-1">
              {data.row_count.toLocaleString()}
            </p>
          </div>

          <div className="bg-purple-50 rounded-lg p-4 border border-purple-200">
            <p className="text-xs text-purple-600 font-semibold uppercase">Columns</p>
            <p className="text-2xl font-bold text-purple-900 mt-1">
              {data.column_count}
            </p>
          </div>

          <div className="bg-orange-50 rounded-lg p-4 border border-orange-200">
            <p className="text-xs text-orange-600 font-semibold uppercase">Total Cells</p>
            <p className="text-2xl font-bold text-orange-900 mt-1">
              {(data.row_count * data.column_count).toLocaleString()}
            </p>
          </div>

          <div className="bg-pink-50 rounded-lg p-4 border border-pink-200">
            <p className="text-xs text-pink-600 font-semibold uppercase">Completeness</p>
            <p className="text-2xl font-bold text-pink-900 mt-1">
              {calculateCompleteness(data)}%
            </p>
          </div>
        </div>
      </div>

      {/* Columns Table */}
      <div className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-800">Column Details</h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-100 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Column Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Missing
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Unique Values
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Sample Values
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {data.columns.map((column, index) => (
                <tr key={index} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="font-medium text-gray-900">{column.name}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                      {column.dtype}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <div className="flex-1 bg-gray-200 rounded-full h-2 max-w-[100px]">
                        <div
                          className={`h-2 rounded-full ${
                            column.null_percentage > 20 ? 'bg-red-500' :
                            column.null_percentage > 5 ? 'bg-yellow-500' :
                            'bg-green-500'
                          }`}
                          style={{ width: `${column.null_percentage}%` }}
                        />
                      </div>
                      <span className="text-sm text-gray-600">
                        {column.null_percentage.toFixed(1)}%
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    {column.unique_count.toLocaleString()}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-wrap gap-1 max-w-md">
                      {column.sample_values.slice(0, 3).map((value, i) => (
                        <span
                          key={i}
                          className="px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded border border-gray-300"
                        >
                          {value === null ? 'null' : String(value)}
                        </span>
                      ))}
                      {column.sample_values.length > 3 && (
                        <span className="px-2 py-1 text-xs text-gray-500">
                          +{column.sample_values.length - 3} more
                        </span>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

/**
 * Calculate overall data completeness percentage
 */
function calculateCompleteness(data: DataProfileResponse): string {
  const totalCells = data.row_count * data.column_count;
  const totalNulls = data.columns.reduce((sum, col) => sum + col.null_count, 0);
  const completeness = ((totalCells - totalNulls) / totalCells) * 100;
  return completeness.toFixed(1);
}
