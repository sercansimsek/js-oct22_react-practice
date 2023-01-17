import React, { useState } from 'react';
import './App.scss';
import cn from 'classnames';

import usersFromServer from './api/users';
import productsFromServer from './api/products';
import categoriesFromServer from './api/categories';
import { User, Category } from './types/types';

function getUserById(ownerId: number | undefined): User | null {
  return usersFromServer.find(user => user.id === ownerId) || null;
}

function getCategoryById(categoryId: number): Category | null {
  return categoriesFromServer
    .find(category => category.id === categoryId) || null;
}

export const newList = productsFromServer.map(product => {
  const category = getCategoryById(product.categoryId);
  const user = getUserById(category?.ownerId);

  return ({
    product,
    category,
    user,
  });
});

export const App: React.FC = () => {
  const [visibleItems, setVisibleItems] = useState(newList);
  const buttonForAll = 'All';
  const [currentUser, setCurrentUser] = useState(buttonForAll);
  const [search, setSearch] = useState('');

  const searchHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(() => event.target.value);
  };

  const filteredProducts = visibleItems.filter(({ product }) => {
    const query = search.toLowerCase().trim();
    const productName = product.name.toLowerCase();

    return productName.includes(query);
  });

  return (
    <div className="section">
      <div className="container">
        <h1 className="title">Product Categories</h1>

        <div className="block">
          <nav className="panel">
            <p className="panel-heading">Filters</p>

            <p className="panel-tabs has-text-weight-bold">
              <a
                data-cy="FilterAllUsers"
                href="#/"
                className={cn({ 'is active': currentUser === buttonForAll })}
                onClick={() => {
                  setCurrentUser(buttonForAll);
                  setVisibleItems(newList);
                }}
              >
                {buttonForAll}
              </a>

              {usersFromServer.map(({
                id,
                name,
              }) => (
                <a
                  data-cy="FilterUser"
                  href="#/"
                  key={id}
                  className={cn({ 'is-active': currentUser === name })}
                  onClick={() => {
                    setCurrentUser(name);
                    setVisibleItems([...newList
                      .filter(item => item.user?.name === name)]);
                  }}
                >
                  {name}
                </a>
              ))}

            </p>

            <div className="panel-block">
              <p className="control has-icons-left has-icons-right">
                <input
                  data-cy="SearchField"
                  type="text"
                  className="input"
                  placeholder="Search"
                  value={search}
                  onChange={(event) => searchHandler(event)}
                />

                <span className="icon is-left">
                  <i className="fas fa-search" aria-hidden="true" />
                </span>

                {search && (
                  <span className="icon is-right">
                    {/* eslint-disable-next-line jsx-a11y/control-has-associated-label */}
                    <button
                      data-cy="ClearButton"
                      type="button"
                      className="delete"
                      onClick={() => setSearch('')}
                    />
                  </span>
                )}
              </p>
            </div>

            <div className="panel-block is-flex-wrap-wrap">
              <a
                href="#/"
                data-cy="AllCategories"
                className="button is-success mr-6 is-outlined"
              >
                All
              </a>

              {
                categoriesFromServer.map(({
                  id,
                  title,
                }) => (
                  <a
                    data-cy="Category"
                    className={cn('button mr-2 my-1', { 'is-info': true })}
                    href="#/"
                    key={id}
                  >
                    {title}
                  </a>
                ))
              }
            </div>

            <div className="panel-block">
              <a
                data-cy="ResetAllButton"
                href="#/"
                className="button is-link is-outlined is-fullwidth"

              >
                Reset all filters
              </a>
            </div>
          </nav>
        </div>

        <div className="box table-container">
          {!filteredProducts.length && (
            <p data-cy="NoMatchingMessage">
              No products matching selected criteria
            </p>
          )}

          {!!filteredProducts.length && (
            <table
              data-cy="ProductTable"
              className="table is-striped is-narrow is-fullwidth"
            >
              <thead>
                <tr>
                  <th>
                    <span className="is-flex is-flex-wrap-nowrap">
                      ID

                      <a href="#/">
                        <span className="icon">
                          <i data-cy="SortIcon" className="fas fa-sort" />
                        </span>
                      </a>
                    </span>
                  </th>

                  <th>
                    <span className="is-flex is-flex-wrap-nowrap">
                      Product

                      <a href="#/">
                        <span className="icon">
                          <i data-cy="SortIcon" className="fas fa-sort-down" />
                        </span>
                      </a>
                    </span>
                  </th>

                  <th>
                    <span className="is-flex is-flex-wrap-nowrap">
                      Category

                      <a href="#/">
                        <span className="icon">
                          <i data-cy="SortIcon" className="fas fa-sort-up" />
                        </span>
                      </a>
                    </span>
                  </th>

                  <th>
                    <span className="is-flex is-flex-wrap-nowrap">
                      User

                      <a href="#/">
                        <span className="icon">
                          <i data-cy="SortIcon" className="fas fa-sort" />
                        </span>
                      </a>
                    </span>
                  </th>
                </tr>
              </thead>

              <tbody>
                {filteredProducts.map(({
                  product,
                  category,
                  user,
                }) => (
                  <tr
                    data-cy="Product"
                    key={product.id}
                  >
                    <td className="has-text-weight-bold" data-cy="ProductId">
                      {product.id}
                    </td>

                    <td data-cy="ProductName">{product.name}</td>
                    <td data-cy="ProductCategory">{`${category?.icon} - ${category?.title}`}</td>

                    <td
                      data-cy="ProductUser"
                      className={cn(
                        { 'has-text-link': user?.sex === 'm' },
                        { 'has-text-danger': user?.sex === 'f' },
                      )}
                    >
                      {user?.name}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};
