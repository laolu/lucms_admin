import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent } from "@/components/ui/card";

interface AttributeValue {
  id: number;
  value: string;
  sort: number;
}

interface Attribute {
  id: number;
  name: string;
  type: 'single' | 'multiple';
  values: AttributeValue[];
  sort: number;
}

interface ModelAttribute {
  id: number;
  name: string;
  type: string;
  sort: number;
  values: AttributeValue[];
}

interface Model {
  id: number;
  name: string;
  description: string;
  attributes: ModelAttribute[];
}

interface ModelAttributesProps {
  model: Model;
  attributeValues: Array<{ attributeId: number; valueId: number }>;
  onAttributeValueChange: (attributeId: number, valueId: number) => void;
}

export function ModelAttributes({
  model,
  attributeValues,
  onAttributeValueChange,
}: ModelAttributesProps) {
  console.log('ModelAttributes 渲染:', {
    model,
    attributeValues
  });

  if (!model?.attributes?.length) {
    return null;
  }

  return (
    <div className="space-y-4">
      {model.attributes
        .sort((a, b) => a.sort - b.sort)
        .map((attribute) => {
          console.log('渲染属性:', {
            attribute,
            selectedValues: attributeValues.filter(av => av.attributeId === attribute.id)
          });
          
          return (
            <Card key={attribute.id} className="border border-gray-200">
              <CardContent className="p-4">
                <div className="flex gap-2 items-center mb-3">
                  <Label className="text-base font-medium">{attribute.name}</Label>
                  <span className="px-2 py-0.5 text-xs text-gray-600 bg-gray-100 rounded-full">
                    {attribute.type === 'single' ? '单选' : '多选'}
                  </span>
                </div>
                
                <div className="flex flex-wrap gap-2">
                  {attribute.values
                    .sort((a, b) => a.sort - b.sort)
                    .map((value) => {
                      const isSelected = attributeValues.some(
                        av => av.attributeId === attribute.id && av.valueId === value.id
                      );
                      
                      console.log('渲染属性值:', {
                        attributeId: attribute.id,
                        valueId: value.id,
                        value: value.value,
                        isSelected
                      });

                      return (
                        <Badge
                          key={value.id}
                          variant={isSelected ? "default" : "outline"}
                          className={`
                            cursor-pointer hover:opacity-80 transition-all
                            ${isSelected ? 'shadow-sm' : ''}
                            ${attribute.type === 'single' ? 'rounded-full' : 'rounded-md'}
                          `}
                          onClick={() => onAttributeValueChange(attribute.id, value.id)}
                        >
                          {value.value}
                        </Badge>
                      );
                    })}
                </div>
              </CardContent>
            </Card>
          );
        })}
    </div>
  );
} 