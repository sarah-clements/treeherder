import React from 'react';
import PropTypes from 'prop-types';
import { Alert } from 'reactstrap';

import PushHealthStatus from '../shared/PushHealthStatus';
import { RevisionList } from '../shared/RevisionList';
import { getJobsUrl } from '../helpers/url';
import RepositoryModel from '../models/repository';
import Clipboard from '../shared/Clipboard';

class CommitHistory extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      clipboardVisible: false,
    };
  }

  showClipboard = show => {
    this.setState({ clipboardVisible: show });
  };

  render() {
    const {
      history: {
        repository,
        revision,
        jobCounts,
        exactMatch,
        parentSha,
        id,
        revisions,
        revisionCount,
      },
    } = this.props;
    const { clipboardVisible } = this.state;
    const repoModel = new RepositoryModel(repository);

    return (
      <React.Fragment>
        <h5>Parent Push</h5>
        {!exactMatch && (
          <div className="ml-4">
            <div
              className="mb-2 ml-3"
              onMouseEnter={() => this.showClipboard(true)}
              onMouseLeave={() => this.showClipboard(false)}
            >
              <Clipboard
                description="full hash"
                text={parentSha}
                visible={clipboardVisible}
              />
              <a
                href={repoModel.getRevisionHref(parentSha)}
                target="_blank"
                rel="noopener noreferrer"
              >
                {parentSha}
              </a>
            </div>
            <Alert color="warning" className="m-3 font-italics">
              Warning: Could not find an exact match parent Push in Treeherder.
            </Alert>
            {id && <div>Closest match: </div>}
          </div>
        )}
        {id && (
          <div className="ml-5">
            <a
              href={`${getJobsUrl({ revision, repo: repository.name })}`}
              className="mx-3"
              target="_blank"
              rel="noopener noreferrer"
              title="Open this push in Treeherder"
            >
              {revision}
            </a>
            <PushHealthStatus
              revision={revision}
              repoName={repository.name}
              jobCounts={jobCounts}
            />
          </div>
        )}
        <h5 className="mt-4">Commit revisions</h5>
        <RevisionList
          revision={revision}
          revisions={revisions.slice(0, 20)}
          revisionCount={revisionCount}
          repo={repoModel}
        />
      </React.Fragment>
    );
  }
}

CommitHistory.propTypes = {
  history: PropTypes.shape({
    repository: PropTypes.object.isRequired,
    revision: PropTypes.string.isRequired,
    revisionCount: PropTypes.number.isRequired,
    job_counts: PropTypes.shape({
      completed: PropTypes.number.isRequired,
      pending: PropTypes.number.isRequired,
      running: PropTypes.number.isRequired,
    }),
    id: PropTypes.number,
  }).isRequired,
};

export default CommitHistory;
