import PagePlaceholder from '../components/common/PagePlaceholder.jsx';
import EmptyState from '../components/common/EmptyState.jsx';

export default function Settings() {
  return (
    <PagePlaceholder
      title="Settings"
      description="Account details and Gmail connection management appear here."
    >
      <EmptyState
        title="No Google account connected"
        message="Sign in with Google to manage your Gmail connection."
      />
    </PagePlaceholder>
  );
}
