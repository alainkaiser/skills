namespace SkillEval.Payments;

public interface IPaymentGateway
{
    Task<PaymentResult> ChargeAsync(Money amount, CancellationToken cancellationToken);
}
