import { useParams } from 'react-router-dom';

const SignalDetails = () => {
  const { id } = useParams();

  return (
    <div style={{ padding: '2rem' }}>
      <h2>🔍 تفاصيل الإشارة</h2>
      <p>معرّف الإشارة: <strong>{id}</strong></p>
      {/* يمكنك لاحقاً استخدام id لجلب تفاصيل من API */}
    </div>
  );
};

export default SignalDetails;