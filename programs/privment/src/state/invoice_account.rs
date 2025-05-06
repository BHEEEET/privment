use anchor_lang::prelude::*;

#[account]
#[derive(InitSpace)]
pub struct InvoiceAccount{
    pub creator: Pubkey,
    pub client: Pubkey,
    #[max_len(50)] 
    pub encrypted_data: String,
    pub paid: bool,
    pub created_at: i64,
    #[max_len(50)] 
    pub invoice_hash: String,
    pub bump: u8,
}