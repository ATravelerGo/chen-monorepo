import { Button } from '@funtoy/ui';
import { it, describe, expect } from 'vitest';
import { render } from '@testing-library/vue';

describe('Button', () => {
	it('should render correctly ', () => {
		const { getByRole } = render(Button);
		expect(getByRole('button')).toBeTruthy();
	});
});
