import { render, screen } from '@testing-library/react';
import ThemeProvider from '../../ThemeProvider';
import { CVEntryHeader } from './CVEntryHeader';

describe('CVEntryHeader', () => {
  it('renders multiple chips in the organization row while leaving supporting metadata separate', () => {
    render(
      <ThemeProvider>
        <CVEntryHeader
          title="B.S. Cum Laude, Mathematics, Applied/Computational"
          organization="Michigan Technological University"
          dateRange="2017 – 2021"
          chips={[
            { label: 'Cumulative: 3.56' },
            { label: 'Departmental: 3.71' },
          ]}
          supportingMeta={['Minor in Computer Science']}
        />
      </ThemeProvider>
    );

    const organizationRow = screen.getByText('Michigan Technological University').parentElement;
    const supportingMetaRow = screen.getByText('Minor in Computer Science').parentElement;

    expect(organizationRow).not.toBeNull();
    expect(organizationRow).toHaveTextContent('Cumulative: 3.56');
    expect(organizationRow).toHaveTextContent('Departmental: 3.71');
    expect(screen.getByText('Cumulative: 3.56').closest('.MuiChip-root')).not.toBeNull();
    expect(screen.getByText('Departmental: 3.71').closest('.MuiChip-root')).not.toBeNull();
    expect(supportingMetaRow).not.toBeNull();
    expect(supportingMetaRow).toHaveTextContent('Minor in Computer Science');
    expect(supportingMetaRow).not.toHaveTextContent('Cumulative: 3.56');
  });
});
