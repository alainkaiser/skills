namespace SkillEval.Orders;

public sealed class OrderService(IOrderRepository repository) : IOrderService
{
    public Task<Order?> GetAsync(Guid id, CancellationToken cancellationToken)
    {
        return repository.GetAsync(id, cancellationToken);
    }
}
