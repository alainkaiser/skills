namespace SkillEval.Orders;

public sealed class OrderRepository(AppDbContext dbContext) : IOrderRepository
{
    public Task<Order?> GetAsync(Guid id, CancellationToken cancellationToken)
    {
        return dbContext.Orders.FindAsync([id], cancellationToken).AsTask();
    }

    public Task SaveChangesAsync(CancellationToken cancellationToken)
    {
        return dbContext.SaveChangesAsync(cancellationToken);
    }
}
