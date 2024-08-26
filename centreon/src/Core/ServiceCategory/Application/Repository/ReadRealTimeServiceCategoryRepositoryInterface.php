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

namespace Core\ServiceCategory\Application\Repository;

use Centreon\Domain\RequestParameters\Interfaces\RequestParametersInterface;
use Core\Tag\RealTime\Domain\Model\Tag;

interface ReadRealTimeServiceCategoryRepositoryInterface
{
    /**
     * @param null|RequestParametersInterface $requestParameters
     *
     * @return Tag[]
     */
    public function findAll(?RequestParametersInterface $requestParameters): array;

    /**
     * @param null|RequestParametersInterface $requestParameters
     * @param int[] $accessGroupIds
     *
     * @return Tag[]
     */
    public function findAllByAccessGroupIds(?RequestParametersInterface $requestParameters, array $accessGroupIds): array;
}