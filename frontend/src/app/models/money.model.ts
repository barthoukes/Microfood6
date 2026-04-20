// money.model.ts

export class Money {
  constructor(private cents: number) {}
  
  get euros(): number {
    return this.cents / 100;
  }
  
  toString(): string {
    const euros = Math.floor(Math.abs(this.cents) / 100);
    const cents = Math.abs(this.cents) % 100;
    return `${this.cents < 0 ? '-' : ''}${euros}.${cents.toString().padStart(2, '0')}`;
  }
  
  add(other: Money): Money {
    return new Money(this.cents + other.cents);
  }
  
  isZero(): boolean {
    return this.cents === 0;
  }
}