<?php

/*
 * Copyright 2005 - 2023 Centreon (https://www.centreon.com/)
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * For more information : contact@centreon.com
 *
 */

declare(strict_types=1);

namespace Core\AdditionalConnector\Application\Repository;

use Centreon\Domain\RequestParameters\Interfaces\RequestParametersInterface;
use Core\AdditionalConnector\Domain\Model\AdditionalConnector;
use Core\AdditionalConnector\Domain\Model\Poller;
use Core\AdditionalConnector\Domain\Model\Type;
use Core\Common\Domain\TrimmedString;
use Core\Security\AccessGroup\Domain\Model\AccessGroup;

interface ReadAdditionalConnectorRepositoryInterface
{
    /**
     * Determine if an Additional Connector (ACC) exists by its name.
     *
     * @param TrimmedString $name
     *
     * @throws \Throwable
     *
     * @return bool
     */
    public function existsByName(TrimmedString $name): bool;

    /**
     * Find an Additional Connector (ACC).
     *
     * @param int $accId
     *
     * @throws \Throwable
     *
     * @return ?AdditionalConnector
     */
    public function find(int $accId): ?AdditionalConnector;

    /**
     * Find alls Additional Connectors (ACCs).
     *
     * @throws \Throwable
     *
     * @return AdditionalConnector[]
     */
    public function findAll(): array;

    /**
     * Find all the pollers associated with any ACC of the specified type.
     *
     * @param Type $type
     *
     * @throws \Throwable
     *
     * @return Poller[]
     */
    public function findPollersByType(Type $type): array;

    /**
     * Find all the pollers associated with an ACC ID.
     *
     * @param int $accId
     *
     * @throws \Throwable
     *
     * @return Poller[]
     */
    public function findPollersByAccId(int $accId): array;

    /**
     * Find all the pollers associated with an ACC ID and AccessGroups.
     *
     * @param int $accId
     * @param AccessGroup[] $accessGroups
     *
     * @throws \Throwable
     *
     * @return Poller[]
     */
    public function findPollersByAccIdAndAccessGroups(int $accId, array $accessGroups): array;

    /**
     * Find all ACC with request parameters.
     *
     * @param RequestParametersInterface $requestParameters
     *
     * @throws \Throwable
     *
     * @return AdditionalConnector[]
     */
    public function findByRequestParameters(RequestParametersInterface $requestParameters): array;

    /**
     * Find all ACC with request parameters.
     *
     * @param RequestParametersInterface $requestParameters
     * @param AccessGroup[] $accessGroups
     *
     * @throws \Throwable
     *
     * @return AdditionalConnector[]
     */
    public function findByRequestParametersAndAccessGroups(
        RequestParametersInterface $requestParameters,
        array $accessGroups
    ): array;
}