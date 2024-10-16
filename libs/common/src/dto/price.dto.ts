import { ApiProperty } from '@nestjs/swagger';

export class GetTokenPriceResponseDto {
  @ApiProperty({
    description: 'Token symbol',
    example: 'BTCUSD',
  })
  symbol: string;

  @ApiProperty({ description: 'Calculated ask', example: 1.1 })
  ask: number;

  @ApiProperty({ description: 'Calculated bid', example: 1.3 })
  bid: number;

  @ApiProperty({ description: 'Calculated mid price', example: 1.2 })
  midPrice: number;
}