namespace SkillEval.Orders;

public interface IOrderService
{
    Task<Order?> GetAsync(Guid id, CancellationToken cancellationToken);
}
