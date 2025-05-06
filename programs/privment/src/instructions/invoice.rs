use anchor_lang::prelude::*;
use crate::state::InvoiceAccount;

#[derive(Accounts)]
pub struct Invoice<'info> {
    #[account(mut)]
    pub creator: Signer<'info>,
    pub client: Signer<'info>,

    #[account(
        init,
        payer = creator,
        seeds = [b"invoice", creator.key().as_ref()],
        bump,
        space = 8 + InvoiceAccount::INIT_SPACE,
    )]
    pub invoice_account: Account<'info, InvoiceAccount>,
    pub system_program: Program<'info, System>,
}

impl<'info> Invoice<'info> {
    pub fn create_invoice(
        &mut self,
        encrypted_data: String,
        invoice_hash: String,
        bumps: &InvoiceBumps,
    ) -> Result<()> {
        self.invoice_account.set_inner(InvoiceAccount {
            creator: self.creator.key(),
            client: self.client.key(),
            encrypted_data,
            paid: false,
            created_at: Clock::get()?.unix_timestamp,
            invoice_hash,
            bump: bumps.invoice_account,
        });

        Ok(())
    }
}
