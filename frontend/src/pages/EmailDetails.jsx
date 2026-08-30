import { useParams } from 'react-router-dom';

import PagePlaceholder from '../components/common/PagePlaceholder.jsx';
import EmptyState from '../components/common/EmptyState.jsx';

export default function EmailDetails() {
  const { id } = useParams();

  return (
    <PagePlaceholder title="Email">
      <EmptyState
        title="Gmail is not connected"
        message={`Message ${id} will be loaded from Gmail once your account is connected.`}
      />
    </PagePlaceholder>
  );
}
