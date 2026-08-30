import PagePlaceholder from '../components/common/PagePlaceholder.jsx';
import HealthStatus from '../components/common/HealthStatus.jsx';

export default function Dashboard() {
  return (
    <PagePlaceholder
      title="Dashboard"
      description="Gmail connection status, unread count, recent emails, and activity appear here once Gmail is connected."
    >
      <HealthStatus />
    </PagePlaceholder>
  );
}
