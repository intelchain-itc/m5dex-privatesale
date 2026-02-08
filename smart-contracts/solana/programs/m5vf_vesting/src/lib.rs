use anchor_lang::prelude::*;
use anchor_spl::token::{self, Mint, Token, TokenAccount, Transfer};

declare_id!("M5VfVstng1111111111111111111111111111111");

#[program]
pub mod m5vf_vesting {
    use super::*;

    pub fn initialize_treasury(ctx: Context<InitializeTreasury>) -> Result<()> {
        let treasury = &mut ctx.accounts.treasury;
        treasury.bump = *ctx.bumps.get("treasury").unwrap();
        Ok(())
    }

    pub fn initialize_vesting(
        ctx: Context<InitializeVesting>,
        total_amount: u64,
        unlock_time: i64,
    ) -> Result<()> {
        let vesting = &mut ctx.accounts.vesting;
        vesting.beneficiary = ctx.accounts.beneficiary.key();
        vesting.mint = ctx.accounts.mint.key();
        vesting.total_amount = total_amount;
        vesting.claimed_amount = 0;
        vesting.unlock_time = unlock_time;
        Ok(())
    }

    pub fn claim(ctx: Context<Claim>) -> Result<()> {
        let clock = Clock::get()?;
        require!(clock.unix_timestamp >= ctx.accounts.vesting.unlock_time, VestingError::Locked);
        let remaining = ctx.accounts.vesting.total_amount - ctx.accounts.vesting.claimed_amount;
        require!(remaining > 0, VestingError::NothingToClaim);

        let seeds = &[b"treasury", ctx.accounts.mint.key().as_ref(), &[ctx.accounts.treasury.bump]];
        let signer = &[&seeds[..]];

        let cpi_accounts = Transfer {
            from: ctx.accounts.treasury_token.to_account_info(),
            to: ctx.accounts.beneficiary_token.to_account_info(),
            authority: ctx.accounts.treasury.to_account_info(),
        };
        let cpi_ctx = CpiContext::new_with_signer(ctx.accounts.token_program.to_account_info(), cpi_accounts, signer);
        token::transfer(cpi_ctx, remaining)?;

        ctx.accounts.vesting.claimed_amount = ctx.accounts.vesting.total_amount;
        Ok(())
    }
}

#[derive(Accounts)]
#[instruction(total_amount: u64, unlock_time: i64)]
pub struct InitializeVesting<'info> {
    #[account(mut)]
    pub payer: Signer<'info>,
    /// CHECK: beneficiary wallet
    pub beneficiary: UncheckedAccount<'info>,
    pub mint: Account<'info, Mint>,
    #[account(
        init,
        payer = payer,
        space = 8 + VestingAccount::INIT_SPACE,
        seeds = [b"vesting", beneficiary.key().as_ref(), mint.key().as_ref()],
        bump
    )]
    pub vesting: Account<'info, VestingAccount>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct InitializeTreasury<'info> {
    #[account(mut)]
    pub payer: Signer<'info>,
    pub mint: Account<'info, Mint>,
    #[account(
        init,
        payer = payer,
        space = 8 + TreasuryAccount::INIT_SPACE,
        seeds = [b"treasury", mint.key().as_ref()],
        bump
    )]
    pub treasury: Account<'info, TreasuryAccount>,
    pub system_program: Program<'info, System>,
}
#[derive(Accounts)]
pub struct Claim<'info> {
    #[account(mut)]
    pub beneficiary: Signer<'info>,
    pub mint: Account<'info, Mint>,
    #[account(
        mut,
        seeds = [b"vesting", beneficiary.key().as_ref(), mint.key().as_ref()],
        bump
    )]
    pub vesting: Account<'info, VestingAccount>,
    #[account(
        seeds = [b"treasury", mint.key().as_ref()],
        bump = treasury.bump
    )]
    pub treasury: Account<'info, TreasuryAccount>,
    #[account(mut)]
    pub treasury_token: Account<'info, TokenAccount>,
    #[account(mut)]
    pub beneficiary_token: Account<'info, TokenAccount>,
    pub token_program: Program<'info, Token>,
}

#[account]
pub struct VestingAccount {
    pub beneficiary: Pubkey,
    pub mint: Pubkey,
    pub total_amount: u64,
    pub claimed_amount: u64,
    pub unlock_time: i64,
}

impl VestingAccount {
    pub const INIT_SPACE: usize = 32 + 32 + 8 + 8 + 8;
}

#[account]
pub struct TreasuryAccount {
    pub bump: u8,
}

impl TreasuryAccount {
    pub const INIT_SPACE: usize = 1;
}

#[error_code]
pub enum VestingError {
    #[msg("Tokens are still locked")]
    Locked,
    #[msg("Nothing to claim")]
    NothingToClaim,
}
