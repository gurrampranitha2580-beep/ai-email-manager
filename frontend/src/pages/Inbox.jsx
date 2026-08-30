import { Inbox as InboxIcon } from 'lucide-react';

import PagePlaceholder from '../components/common/PagePlaceholder.jsx';
import EmptyState from '../components/common/EmptyState.jsx';

export default function Inbox() {
  return (
    <PagePlaceholder title="Inbox">
      <EmptyState
        icon={InboxIcon}
        title="Gmail is not connected"
        message="Connect your Google account to load your real inbox."
      />
    </PagePlaceholder>
  );
}
