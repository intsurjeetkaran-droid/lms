import { useState, useEffect } from 'react';
import axios from 'axios';
import DashboardLayout from '../../components/DashboardLayout';
import AlertDialog from '../../components/AlertDialog';

const ManageComplaints = () => {
  const [complaints, setComplaints] = useState([]);
  const [filter, setFilter] = useState('all');
  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(true);
  
  // Alert dialog state
  const [alertDialog, setAlertDialog] = useState({ isOpen: false, type: 'info', title: '', message: '' });

  useEffect(() => {
    fetchComplaints();
  }, []);

  const fetchComplaints = async () => {
    try {
      const { data } = await axios.get('/api/complaints');
      setComplaints(data);
    } catch (error) {
      console.error('Error fetching complaints:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (complaintId, status) => {
    try {
      await axios.put(`/api/complaints/${complaintId}`, {
        status,
        adminResponse: response
      });
      setAlertDialog({
        isOpen: true,
        type: 'success',
        title: 'Success',
        message: 'Complaint updated successfully!'
      });
      setSelectedComplaint(null);
      setResponse('');
      fetchComplaints();
    } catch (error) {
      console.error('Error updating complaint:', error);
      setAlertDialog({
        isOpen: true,
        type: 'error',
        title: 'Error',
        message: 'Failed to update complaint'
      });
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400',
      in_progress: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
      resolved: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
      rejected: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
    };
    return colors[status] || 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400';
  };

  const filteredComplaints = filter === 'all' 
    ? complaints 
    : complaints.filter(c => c.status === filter);

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-96">
          <div className="text-xl text-slate-700 dark:text-slate-300">Loading complaints...</div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto">
        <div className="mb-6 md:mb-8">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-slate-900 dark:text-slate-100">Manage Complaints</h1>
        </div>
        
        {/* Filter Tabs */}
        <div className="flex gap-2 mb-6 flex-wrap">
          {['all', 'pending', 'in_progress', 'resolved', 'rejected'].map((status) => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={`px-4 py-2 rounded-lg transition-all duration-300 ${
                filter === status
                  ? 'bg-gradient-to-r from-blue-600 to-violet-600 text-white shadow-lg'
                  : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700'
              }`}
            >
              {status === 'all' ? 'All' : status.replace('_', ' ').toUpperCase()}
            </button>
          ))}
        </div>

        {/* Complaints List */}
        {filteredComplaints.length === 0 ? (
          <div className="bg-white dark:bg-slate-800 p-8 rounded-lg shadow text-center border border-slate-200 dark:border-slate-700">
            <p className="text-xl text-slate-600 dark:text-slate-400">No complaints found</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredComplaints.map((complaint) => (
              <div key={complaint._id} className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow border border-slate-200 dark:border-slate-700">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                      Complaint #{complaint._id.slice(-6)}
                    </h3>
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                      Type: {complaint.type.toUpperCase()}
                    </p>
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                      Customer: {complaint.customerId?.name} ({complaint.customerId?.phone})
                    </p>
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                      Provider: {complaint.providerId?.name}
                    </p>
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                      Date: {new Date(complaint.createdAt).toLocaleString()}
                    </p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(complaint.status)}`}>
                    {complaint.status.replace('_', ' ').toUpperCase()}
                  </span>
                </div>

                <div className="border-t border-slate-200 dark:border-slate-700 pt-4 mb-4">
                  <p className="font-medium mb-2 text-slate-900 dark:text-slate-100">Description:</p>
                  <p className="text-slate-700 dark:text-slate-300">{complaint.description}</p>
                </div>

                {complaint.adminResponse && (
                  <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded mb-4 border border-blue-200 dark:border-blue-800">
                    <p className="font-medium mb-2 text-slate-900 dark:text-slate-100">Admin Response:</p>
                    <p className="text-slate-700 dark:text-slate-300">{complaint.adminResponse}</p>
                  </div>
                )}

                {complaint.status === 'pending' && (
                  <div className="flex gap-2">
                    <button
                      onClick={() => setSelectedComplaint(complaint)}
                      className="bg-gradient-to-r from-blue-600 to-violet-600 text-white px-4 py-2 rounded-lg hover:from-blue-700 hover:to-violet-700 transition-all"
                    >
                      Handle Complaint
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Modal for handling complaint */}
        {selectedComplaint && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white dark:bg-slate-800 rounded-lg p-6 max-w-2xl w-full border border-slate-200 dark:border-slate-700">
              <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-slate-100">Handle Complaint</h2>
              
              <div className="mb-4">
                <p className="font-medium text-slate-900 dark:text-slate-100">Type: {selectedComplaint.type.toUpperCase()}</p>
                <p className="text-slate-700 dark:text-slate-300 mt-2">{selectedComplaint.description}</p>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium mb-2 text-slate-900 dark:text-slate-100">Admin Response</label>
                <textarea
                  value={response}
                  onChange={(e) => setResponse(e.target.value)}
                  rows="4"
                  className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100"
                  placeholder="Enter your response..."
                />
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => handleUpdateStatus(selectedComplaint._id, 'in_progress')}
                  className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-all"
                >
                  Mark In Progress
                </button>
                <button
                  onClick={() => handleUpdateStatus(selectedComplaint._id, 'resolved')}
                  className="flex-1 bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition-all"
                >
                  Resolve
                </button>
                <button
                  onClick={() => handleUpdateStatus(selectedComplaint._id, 'rejected')}
                  className="flex-1 bg-red-600 text-white py-2 rounded-lg hover:bg-red-700 transition-all"
                >
                  Reject
                </button>
                <button
                  onClick={() => {
                    setSelectedComplaint(null);
                    setResponse('');
                  }}
                  className="px-4 bg-slate-300 dark:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-lg hover:bg-slate-400 dark:hover:bg-slate-600 transition-all"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Alert Dialog */}
      <AlertDialog
        isOpen={alertDialog.isOpen}
        onClose={() => setAlertDialog({ isOpen: false, type: 'info', title: '', message: '' })}
        title={alertDialog.title}
        message={alertDialog.message}
        type={alertDialog.type}
      />
    </DashboardLayout>
  );
};

export default ManageComplaints;
