use anchor_lang::prelude::*;

#[account]
#[derive(InitSpace)]
pub struct RegisterAccount{
    #[max_len(50)] 
    pub total_received: String,
    #[max_len(50)] 
    pub total_payed: String,
    pub bump: u8,
}