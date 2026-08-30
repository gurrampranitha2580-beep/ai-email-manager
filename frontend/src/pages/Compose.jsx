import PagePlaceholder from '../components/common/PagePlaceholder.jsx';
import EmptyState from '../components/common/EmptyState.jsx';

export default function Compose() {
  return (
    <PagePlaceholder title="Compose">
      <EmptyState
        title="Gmail is not connected"
        message="Connect your Google account to compose and send email."
      />
    </PagePlaceholder>
  );
}
