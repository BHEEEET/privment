use anchor_lang::prelude::*;
use crate::state::RegisterAccount;

#[derive(Accounts)]
pub struct Register<'info> {
    #[account(mut)]
    pub user: Signer<'info>,

    #[account(
        init,
        payer = user,
        seeds = [b"user", user.key().as_ref()],
        bump,
        space = 8 + RegisterAccount::INIT_SPACE,
    )]
    pub register_account: Account<'info, RegisterAccount>,
    pub system_program: Program<'info, System>
}

impl <'info> Register<'info> {
    pub fn register_user(&mut self, bumps: &RegisterBumps) -> Result<()>{
     
        self.register_account.set_inner(RegisterAccount {  
            total_received: String::from(""), 
            total_payed: String::from(""), 
            bump: bumps.register_account 
        });

        Ok(())
    }
}
