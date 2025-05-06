#![allow(unexpected_cfgs)]
use anchor_lang::prelude::*;
mod instructions;
mod state;
use crate::instructions::*;

declare_id!("BGGhrLBFZfQgg7aB4pKr84hSDsLKsL4ZzRkaDAUoVrfQ");

#[program]
pub mod privment {
    use super::*;

    pub fn register(ctx: Context<Register>) -> Result<()> {
        ctx.accounts.register_user(&ctx.bumps)
    }

    pub fn create_invoice(ctx: Context<Invoice>, to: Pubkey) -> Result<()>{
        ctx.accounts.create_invoice(to ,&ctx.bumps)
    }
}