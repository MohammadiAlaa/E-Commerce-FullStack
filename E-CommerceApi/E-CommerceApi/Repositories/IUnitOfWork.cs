using Microsoft.EntityFrameworkCore.Storage; 
namespace E_CommerceApi.Repositories
{
    public interface IUnitOfWork : IDisposable
    {
        IGenericRepository<T> Repository<T>() where T : class;
        Task<int> CompleteAsync();

        Task<IDbContextTransaction> BeginTransactionAsync(); 
    }
}
