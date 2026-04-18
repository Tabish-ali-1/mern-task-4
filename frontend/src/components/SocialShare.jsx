import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import api from '../utils/api';

const SocialShare = () => {
  const { id } = useParams();
  const [shareData, setShareData] = useState(null);

  useEffect(() => {
    const fetchShare = async () => {
      try {
        const res = await api.get(`/share/${id}`);
        setShareData(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchShare();
  }, [id]);

  if (!shareData) return <p>Loading...</p>;

  const shareUrl = `${window.location.origin}/share/${id}`;

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      alert('Link copied to clipboard!');
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="glass-card" style={{ padding: '2rem', maxWidth: '600px', margin: 'auto' }}>
      <h3 style={{ color: 'var(--primary)', marginBottom: '1rem' }}>Share Your Achievement</h3>
      <p>{shareData.message || 'Check out this achievement!'}</p>
      <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
        <input
          type="text"
          readOnly
          value={shareUrl}
          className="input-field"
          style={{ flex: 1 }}
        />
        <button onClick={copyToClipboard} className="btn btn-primary">
          Copy Link
        </button>
      </div>
    </div>
  );
};

export default SocialShare;
