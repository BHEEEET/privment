#![allow(unexpected_cfgs)]
use anchor_lang::prelude::*;
mod instructions;
mod state;
use crate::instructions::*;

declare_id!("BGGhrLBFZfQgg7aB4pKr84hSDsLKsL4ZzRkaDAUoVrfQ");

#[program]
pub mod privment {
    use super::*;

    pub fn register(ctx: Context<InitUser>, name: String) -> Result<()> {
        ctx.accounts.init_user(name, &ctx.bumps)
    }

    pub fn create_invoice(ctx: Context<InitInvoice>, amount: u64) -> Result<()>{
        ctx.accounts.init_invoice(amount ,&ctx.bumps)
    }

    pub fn pay_invoice(ctx: Context<Pay>, amount: u64) -> Result<()>{
        ctx.accounts.mint_tokens(amount)?;
        ctx.accounts.pay(&ctx.bumps)
    }
}