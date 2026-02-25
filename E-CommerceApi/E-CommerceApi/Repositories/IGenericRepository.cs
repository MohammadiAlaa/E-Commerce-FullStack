using System.Linq.Expressions;

namespace E_CommerceApi.Repositories
{
    public interface IGenericRepository<T> where T : class
    {
        Task<IEnumerable<T>> GetAllAsync(string include = null);

        Task<T> GetByIdAsync(int id, string include = null);
        Task<T> FindAsync(Expression<Func<T, bool>> criteria, string[] includes = null);
        Task<IEnumerable<T>> FindAllAsync(Expression<Func<T, bool>> criteria, string[] includes = null);
        IQueryable<T> GetTableNoTracking();

        Task AddAsync(T entity);
        void Update(T entity);
        void Delete(T entity);
    }
}