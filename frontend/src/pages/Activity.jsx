import PagePlaceholder from '../components/common/PagePlaceholder.jsx';
import EmptyState from '../components/common/EmptyState.jsx';

export default function Activity() {
  return (
    <PagePlaceholder title="Activity">
      <EmptyState
        title="No activity yet"
        message="Actions such as opening, starring, or sending email will be listed here."
      />
    </PagePlaceholder>
  );
}
