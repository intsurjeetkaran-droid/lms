import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import DashboardLayout from '../../components/DashboardLayout';
import AlertDialog from '../../components/AlertDialog';

const GiveFeedback = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const [rating, setRating] = useState(0);
  const [review, setReview] = useState('');
  const [loading, setLoading] = useState(false);
  
  // Alert dialog state
  const [alertDialog, setAlertDialog] = useState({ isOpen: false, type: 'info', title: '', message: '' });

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (rating === 0) {
      setAlertDialog({
        isOpen: true,
        type: 'warning',
        title: 'Rating Required',
        message: 'Please select a rating'
      });
      return;
    }

    setLoading(true);
    try {
      await axios.post('/api/feedback', {
        orderId,
        rating,
        review
      });
      
      setAlertDialog({
        isOpen: true,
        type: 'success',
        title: 'Success',
        message: 'Feedback submitted successfully!'
      });
      setTimeout(() => navigate('/customer/orders'), 2000);
    } catch (error) {
      console.error('Error submitting feedback:', error);
      setAlertDialog({
        isOpen: true,
        type: 'error',
        title: 'Error',
        message: error.response?.data?.message || 'Failed to submit feedback'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="max-w-2xl mx-auto">
        <div className="mb-6 md:mb-8">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-slate-900 dark:text-slate-100">Give Feedback</h1>
        </div>
          
          <div className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow dark:shadow-slate-900/50">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Rating */}
              <div>
                <label className="block text-lg font-medium mb-4 text-slate-900 dark:text-slate-100">Rating</label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRating(star)}
                      className={`text-4xl transition-colors ${
                        star <= rating ? 'text-yellow-400' : 'text-gray-300 dark:text-gray-600'
                      }`}
                    >
                      ★
                    </button>
                  ))}
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                  {rating > 0 && `You rated ${rating} out of 5 stars`}
                </p>
              </div>

              {/* Review */}
              <div>
                <label className="block text-lg font-medium mb-2 text-slate-900 dark:text-slate-100">Review (Optional)</label>
                <textarea
                  value={review}
                  onChange={(e) => setReview(e.target.value)}
                  rows="5"
                  placeholder="Share your experience..."
                  className="w-full px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 placeholder-gray-400 dark:placeholder-gray-500"
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading || rating === 0}
                className="w-full bg-blue-600 dark:bg-blue-500 text-white py-3 rounded-lg hover:bg-blue-700 dark:hover:bg-blue-600 disabled:bg-gray-400 dark:disabled:bg-gray-600 disabled:cursor-not-allowed transition-colors"
              >
                {loading ? 'Submitting...' : 'Submit Feedback'}
              </button>
            </form>
        </div>
      </div>

      {/* Alert Dialog */}
      <AlertDialog
        isOpen={alertDialog.isOpen}
        onClose={() => {
          setAlertDialog({ isOpen: false, type: 'info', title: '', message: '' });
          if (alertDialog.type === 'success') {
            navigate('/customer/orders');
          }
        }}
        title={alertDialog.title}
        message={alertDialog.message}
        type={alertDialog.type}
      />
    </DashboardLayout>
  );
};

export default GiveFeedback;
