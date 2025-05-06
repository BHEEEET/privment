use anchor_lang::prelude::*;
use solana_program::pubkey::Pubkey;
use solana_sdk::{
    signature::{Keypair, Signer as KeySigner},
    transaction::Transaction
};
use anchor_spl::{
    associated_token::AssociatedToken,
    token_interface::{mint_to, transfer_checked, Token2022, TokenAccount, TransferChecked},
};
use spl_token_2022::extension::confidential_transfer::instruction as confidential_ix;
use spl_token_2022::id as token_22_program_id;
use spl_token_client::{
    token::Token,
    
};

use crate::state::ReceiptAccount;

#[derive(Accounts)]
pub struct Pay<'info> {
    #[account(mut)]
    pub creator: Signer<'info>,
    #[account(mut)]
    pub client: Signer<'info>,
    #[account(mut)]
    pub mint_a: Signer<'info>,
    #[account(mut)]
    pub creator_ata_a: AccountInfo<'info>,
    #[account(
        init_if_needed,
        payer = client,
        associated_token::mint = mint_a,
        associated_token::authority = client,
        associated_token::token_program = token_program,
    )]
    pub client_ata_a: InterfaceAccount<'info, TokenAccount>,
    #[account(
        init,
        payer = creator,
        seeds = [b"receipt", creator.key().as_ref()],
        bump,
        space = 8 + ReceiptAccount::INIT_SPACE,
    )]
    pub receipt_account: Account<'info, ReceiptAccount>,
    pub system_program: Program<'info, System>,
    pub token_program: Program<'info, Token2022>,
    pub associated_token_program: Program<'info, AssociatedToken>,
}

impl<'info> Pay<'info> {
    pub fn mint_tokens(&self) -> Result<()> {
        // let space = match ExtensionType::try_calculate_account_len::<Mint>(&[
        //     ExtensionType::ConfidentialTransferMint,
        // ]) {
        //     Ok(space) => space,
        //     Err(e) => return Err(e.into()), // propagate the error
        // };

        let ix = confidential_ix::initialize_mint(
            &self.token_program.key(),
            &self.mint_a.key(),
            Some(self.client.key()),
            true,
            None,
        );

        let tx = Transaction::new_signed_with_payer(
            &[ix], 
            Some(&self.client.key()), 
            &[&self.client], 
            recent_blockhash
        );



        Ok(())
    }

    // pub fn deposit_tokens(&self, amount: u64) -> Result<()> {
    //     let cpi_program = self.token_program.to_account_info();

    //     let cpi_accounts = TransferChecked {
    //         from: self.client_ata_a.to_account_info(),
    //         mint: self.mint_a.to_account_info(),
    //         to: self.creator_ata_a.to_account_info(),
    //         authority: self.client.to_account_info(),
    //     };

    //     let cpi_ctx = CpiContext::new(cpi_program, cpi_accounts);

    //     transfer_checked(cpi_ctx, amount, self.mint_a.decimals)
    // }

    // pub fn pay(&self, amount: u64) -> Result<()> {
    //     let cpi_program = self.system_program.to_account_info();

    //     let cpi_account = TransferChecked {
    //         from: self.client.to_account_info(),
    //         mint: self.mint_a.to_account_info(),
    //         to: self.creator.to_account_info(),
    //         authority: self.client.to_account_info(),
    //     };

    //     let cpi_ctx = CpiContext::new(cpi_program, cpi_account);

    //     transfer_checked(cpi_ctx, amount, self.mint_a.decimals)?;

    //     Ok(())
    // }

    pub fn create_receipt(
        &mut self,
        encrypted_data: String,
        invoice_hash: String,
        bumps: PayBumps,
    ) -> Result<()> {
        Ok(())
    }
}
