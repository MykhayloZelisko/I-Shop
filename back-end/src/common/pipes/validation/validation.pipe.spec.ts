import { ValidationPipe } from './validation.pipe';

describe('ValidationPipe', () => {
  const pipe: ValidationPipe = new ValidationPipe();

  it('should be defined', () => {
    expect(pipe).toBeDefined();
  });
});
