use anchor_lang::prelude::*;

#[account]
#[derive(InitSpace)]
pub struct ReceiptAccount{
    pub from: Pubkey,
    pub to: Pubkey,
    #[max_len(50)] 
    pub encrypted_amount: String,
    pub paid_at: u64,
    pub bump: u8,
}