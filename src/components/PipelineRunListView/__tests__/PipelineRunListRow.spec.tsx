import React from 'react';
import { render } from '@testing-library/react';
import { DataState, testPipelineRuns } from '../../../__data__/pipelinerun-data';
import { PipelineRunListRowWithVulnerabilities } from '../PipelineRunListRow';

jest.mock('react-router-dom', () => {
  const actual = jest.requireActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => jest.fn(),
    Link: (props) => <a href={props.to}>{props.children}</a>,
    useSearchParams: jest.fn(),
  };
});

describe('Pipeline run Row', () => {
  it('should return - when pipelinerun is in running state ', () => {
    const runningPipelineRun = testPipelineRuns[DataState.RUNNING];
    const row = render(
      <PipelineRunListRowWithVulnerabilities obj={runningPipelineRun} columns={[]} />,
    );

    expect(row.getByText('-')).toBeDefined();
    expect(row.getByText('Running')).toBeDefined();
  });

  it('should return - when vulnerabilities is not available ', () => {
    const succeededPlr = testPipelineRuns[DataState.SUCCEEDED];
    const plrName = succeededPlr.metadata.name;
    const row = render(
      <PipelineRunListRowWithVulnerabilities
        obj={succeededPlr}
        customData={{
          fetchedPipelineRuns: [plrName],
          vulnerabilities: [{ [plrName]: {} }],
        }}
        columns={[]}
      />,
    );

    expect(row.getByText('-')).toBeDefined();
    expect(row.getByText('Succeeded')).toBeDefined();
  });

  it('should show vulnerabilities when it is available ', () => {
    const succeededPlr = testPipelineRuns[DataState.SUCCEEDED];
    const plrName = succeededPlr.metadata.name;
    const row = render(
      <PipelineRunListRowWithVulnerabilities
        obj={succeededPlr}
        customData={{
          fetchedPipelineRuns: [plrName],
          vulnerabilities: {
            [plrName]: [
              {
                vulnerabilities: {
                  critical: 5,
                  medium: 0,
                  high: 0,
                  low: 0,
                },
              },
            ],
          },
        }}
        columns={[]}
      />,
    );

    expect(row.getByText('Critical')).toBeDefined();
    expect(row.getByText('5')).toBeDefined();
    expect(row.getByText('Succeeded')).toBeDefined();
  });
});
